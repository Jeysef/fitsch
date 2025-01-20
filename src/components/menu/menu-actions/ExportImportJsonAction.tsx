import { exportJSON, importJSON } from "~/components/menu/ImportExport";
import { getFileName } from "~/components/menu/menu-actions/utils";
import { ItemText } from "~/components/menu/MenuCommonComponents";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { toast } from "~/packages/solid-sonner";
import { storeSerializer, useScheduler } from "~/providers/SchedulerProvider";

function ExportImportJsonAction() {
  const { store, recreateStore } = useScheduler();
  const { t, locale } = useI18n();

  const saveJSON = () => {
    const filename = getFileName({ locale, store });
    exportJSON({ obj: store, filename, serializer: storeSerializer });
  };

  const loadJSON = () => {
    importJSON({
      onImport: (data) => {
        const parsedData = JSON.parse(data, ClassRegistry.reviver);
        const validatedData = parseStoreJson(parsedData);
        if (!validatedData.success) {
          console.error(validatedData.error);
          toast.error(t("menu.actions.importJson.error"), { description: t("menu.actions.importJson.errorDescription") });
          return;
        }
        recreateStore(validatedData.data);
      },
      onError: (err) => {
        toast.error(t("menu.actions.importJson.error"), { description: t("menu.actions.importJson.errorDescription") });
      },
    });
  };
  return (
    <>
      <ItemText as="div">
        <Button
          type="button"
          size={null}
          variant={"ghost"}
          class="px-2 py-1 text-link hover:text-link hover:saturate-150"
          on:click={saveJSON}
        >
          {t("menu.actions.exportJson")}
        </Button>
      </ItemText>
      <ItemText as="div">
        <Button
          type="button"
          size={null}
          variant={"ghost"}
          class="px-2 py-1 text-link hover:text-link hover:saturate-150"
          on:click={loadJSON}
        >
          {t("menu.actions.importJson.title")}
        </Button>
      </ItemText>
    </>
  );
}
export default ExportImportJsonAction;
