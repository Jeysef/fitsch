interface ImportJSONProps {
  /**
   * @param data The imported JSON string.
   */
  onImport: (data: string) => void;
}

interface ExportJSONProps {
  obj: any;
  /**
   * The filename to save the JSON file as.
   * Without the extension.
   */
  filename: string;
}

export function importJSON(props: ImportJSONProps) {
  const { onImport } = props;
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = false;
  input.accept = ".json";
  input.setAttribute("style", "visibility:hidden");
  input.click();
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(reader.result as string);
      } catch (e) {
        console.error(e);
      }
    };
    reader.readAsText(file);
  };
  input.remove();
}

const JSON_MIME_TYPE = "text/json;charset=utf-8";

export function exportJSON(props: ExportJSONProps) {
  const { obj, filename } = props;
  const plainObj = JSON.stringify(obj, null, 2);
  const blob = new Blob([plainObj], {
    type: JSON_MIME_TYPE,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  try {
    a.setAttribute("style", "visibility:hidden");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
  } finally {
    // Cleanup
    a.remove();
    URL.revokeObjectURL(url);
  }
}
