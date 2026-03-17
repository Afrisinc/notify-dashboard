/**
 * useEmailEditor Hook
 *
 * Manages email template editor state for AfriSinc Notify backend integration.
 *
 * Features:
 * - Load templates from AfriSinc Notify API with design_json extraction
 * - Manage editor state (template name, subject, HTML content, JSON document)
 * - Save to AfriSinc Notify backend with React Query mutations
 * - Automatic cache invalidation on create/update
 * - Round-trip editing support (JSON embedded in HTML comments)
 * - HTML export for email testing
 *
 * Integration Points:
 * - getAppTemplateService(): Fetch template from /api/apps/:appId/templates/:templateId
 * - useCreateAppTemplate(): React Query mutation for POST /api/apps/:appId/templates
 * - useUpdateAppTemplate(): React Query mutation for PUT /api/apps/:appId/templates/:templateId
 * - EmailBuilder.js: Visual editor for email template design
 * - EditorContext: Zustand store for document state management
 */

import { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { getAppTemplateService } from '@/services/apps';
import { useDocument, resetDocument } from '../core/documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useCurrentAccountId } from '@/hooks/useAuth';
import { useCreateAppTemplate, useUpdateAppTemplate } from '@/hooks/useApps';

interface UseEmailEditorOptions {
  appId: string;
  templateId: string;
}

interface UseEmailEditorReturn {
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  templateName: string;
  setTemplateName: (name: string) => void;
  subject: string;
  setSubject: (s: string) => void;
  save: () => Promise<void>;
  exportHTML: () => string;
}

/**
 * Parse email builder JSON from HTML comment
 * Looks for: <!-- emailbuilder-json:{base64EncodedJson} -->
 */
function extractJsonFromHtml(html: string): object | null {
  const match = html.match(/<!-- emailbuilder-json:(.+?) -->/);
  if (!match || !match[1]) return null;
  try {
    const decoded = atob(match[1]);
    return JSON.parse(decoded);
  } catch {
    console.warn('Failed to parse emailbuilder JSON from HTML comment');
    return null;
  }
}

/**
 * Extract clean HTML without the JSON comment
 */
function cleanHtmlFromComment(html: string): string {
  return html.replace(/\n?<!-- emailbuilder-json:.+? -->/g, '').trim();
}

/**
 * Embed JSON in HTML as a comment (for storage)
 */
function embedJsonInHtml(html: string, json: object): string {
  // Remove existing comment if present
  const clean = cleanHtmlFromComment(html);
  const encoded = btoa(JSON.stringify(json));
  return `${clean}\n<!-- emailbuilder-json:${encoded} -->`;
}

/**
 * Create a minimal valid email document structure
 * The editor requires at least a root EmailLayout block with proper EmailLayout data
 */
function createEmptyEmailDocument(): any {
  return {
    root: {
      type: 'EmailLayout',
      data: {
        backdropColor: '#F5F5F5',
        canvasColor: '#FFFFFF',
        borderColor: null,
        borderRadius: 0,
        textColor: '#000000',
        fontFamily: null,
        childrenIds: [],
      },
      children: [],
    },
  };
}

/**
 * Hook to manage email template editor state and operations
 */
export function useEmailEditor({ appId, templateId }: UseEmailEditorOptions): UseEmailEditorReturn {
  const { selectedApp } = useAppContext();
  const currentDocument = useDocument();
  const accountId = useCurrentAccountId();

  // React Query mutations for create and update
  const createMutation = useCreateAppTemplate();
  const updateMutation = useUpdateAppTemplate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');

  /**
   * Load template on mount or when templateId changes
   * Only loads when accountId is available (organization is set)
   * Skips loading for new templates (templateId === 'new')
   */
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!accountId) {
          setError('No account selected. Please select an organization.');
          setIsLoading(false);
          return;
        }

        // For new templates, initialize with empty document
        if (templateId === 'new') {
          resetDocument(createEmptyEmailDocument());
          setTemplateName('');
          setSubject('');
          setIsLoading(false);
          return;
        }

        // Fetch template from API for existing templates
        const response = await getAppTemplateService(appId, templateId, accountId);
        const template = response.template || response;

        // Extract template data
        setTemplateName(template.description || template.code || '');
        setSubject(template.subject || '');

        // Priority 1: Use design_json if provided by backend
        let designJson = template.design_json;

        // Priority 2: Extract JSON from HTML comment if design_json not available
        if (!designJson && template.content) {
          designJson = extractJsonFromHtml(template.content);
        }

        if (designJson && typeof designJson === 'object') {
          // Use the stored JSON to initialize the editor
          resetDocument(designJson);
        } else {
          // Fallback: start with empty editor if no JSON found
          // console.log('No design JSON found in template, starting with empty editor');
          resetDocument(createEmptyEmailDocument());
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load template';
        setError(message);
        console.error('Error loading template:', err);
        // Initialize with empty document on error
        resetDocument(createEmptyEmailDocument());
      } finally {
        setIsLoading(false);
      }
    };

    if (appId && templateId) {
      loadTemplate();
    }
  }, [appId, templateId, accountId]);

  /**
   * Save template with current editor state
   * Renders the document to HTML and embeds JSON in a comment
   * Handles both creating new templates and updating existing ones
   * Uses React Query mutations for automatic cache invalidation
   */
  const save = async (): Promise<void> => {
    if (!appId || !templateId || !selectedApp) {
      setError('Missing required app or template information');
      return;
    }

    if (!templateName) {
      setError('Template name is required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Render the document to static markup HTML
      // renderToStaticMarkup from @usewaypoint/email-builder converts the document to HTML
      const htmlContent = renderToStaticMarkup(currentDocument, { rootBlockId: 'root' });

      // Embed the JSON in the HTML as a comment for round-trip editing
      const htmlWithJson = embedJsonInHtml(htmlContent, currentDocument);

      const payload = {
        code: templateName.toUpperCase().replace(/\s+/g, '_'),
        channel: 'EMAIL' as const,
        subject: subject,
        content: htmlWithJson,
        description: templateName,
      };

      // Create new template or update existing one using React Query mutations
      if (templateId === 'new') {
        await createMutation.mutateAsync({ appId, payload });
      } else {
        await updateMutation.mutateAsync({ appId, templateId, payload });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save template';
      setError(message);
      console.error('Error saving template:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Export clean HTML without the JSON comment
   * This is the HTML that would be sent to users
   */
  const exportHTML = (): string => {
    const htmlContent = renderToStaticMarkup(currentDocument, { rootBlockId: 'root' });
    return cleanHtmlFromComment(htmlContent);
  };

  return {
    isLoading,
    isSaving,
    error,
    templateName,
    setTemplateName,
    subject,
    setSubject,
    save,
    exportHTML,
  };
}
