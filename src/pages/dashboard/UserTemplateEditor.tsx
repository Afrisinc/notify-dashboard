import { useParams, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { EmailEditor } from "@/components/EmailEditor/EmailEditor";
import theme from "@/components/EmailEditor/core/theme";

export default function UserTemplateEditor() {
  const { id: templateId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!templateId) {
    return <div>Invalid template</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmailEditor
        templateId={templateId}
        onCancel={() => navigate("/dashboard/templates")}
      />
    </ThemeProvider>
  );
}
