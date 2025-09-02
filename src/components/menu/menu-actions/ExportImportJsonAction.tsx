import { toast } from "solid-sonner";
import { exportJSON, importJSON } from "~/components/menu/ImportExport";
import { getFileName } from "~/components/menu/menu-actions/utils";
import { ItemText } from "~/components/menu/MenuCommonComponents";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { ClassRegistry } from "~/lib/classRegistry/classRegistry";
import { useScheduler } from "~/providers/SchedulerProvider";
import { parseStoreJson } from "~/store/storeSchema";

function ExportImportJsonAction() {
  const { store, recreateStore, serialize } = useScheduler();
  const { t, locale } = useI18n();

  const saveJSON = () => {
    const filename = getFileName({ locale, store });
    exportJSON({ obj: store, filename, serializer: serialize });
  };

  const loadJSON = () => {
    importJSON({
      onImport: (data) => {
        const parsedData = JSON.parse(data, ClassRegistry.reviver);
        const validatedData = parseStoreJson(parsedData);
        if (!validatedData.success) {
          console.error(validatedData.issues);
          toast.error(t("menu.actions.importJson.error"), { description: t("menu.actions.importJson.errorDescription") });
          return;
        }
        recreateStore(validatedData.output);
      },
      onError: () => {
        toast.error(t("menu.actions.importJson.error"), { description: t("menu.actions.importJson.errorDescription") });
      },
    });
  };
  return (
    <>
      <ItemText as="div">
        <Button type="button" size={null} variant={"ghost"} class="px-2 py-1 text-link-external" on:click={saveJSON}>
          {t("menu.actions.exportJson")}
        </Button>
      </ItemText>
      <ItemText as="div">
        <Button type="button" size={null} variant={"ghost"} class="px-2 py-1 text-link-external" on:click={loadJSON}>
          {t("menu.actions.importJson.title")}
        </Button>
      </ItemText>
    </>
  );
}
export default ExportImportJsonAction;
