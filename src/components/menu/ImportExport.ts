interface ImportJSONProps {
  /**
   * @param data The imported JSON string.
   */
  onImport: (data: string) => void;
  onError: (err: unknown) => void;
}

interface ExportJSONProps<T> {
  obj: T;
  /**
   * The filename to save the JSON file as.
   * Without the extension.
   */
  filename: string;
  serializer?: (obj: T) => string;
}

export function importJSON(props: ImportJSONProps) {
  const { onImport, onError } = props;
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
        onError ? onError(e) : console.error(e);
      }
    };
    reader.readAsText(file);
  };
  input.remove();
}

const JSON_MIME_TYPE = "text/json;charset=utf-8";

export function exportJSON<T>(props: ExportJSONProps<T>) {
  const { obj, filename } = props;
  const plainObj = props.serializer ? props.serializer(obj) : JSON.stringify(obj);
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
