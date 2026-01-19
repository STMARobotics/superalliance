"use client";

import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { Affix, Button, LoadingOverlay, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import QuantFormView from "@/components/quant-form-view";
import { useParams } from "react-router-dom";

function DataQuantStandForm() {
  const [scroll, scrollTo] = useWindowScroll();
  const [formData, setFormData] = useState<any>(null);
  const [visible, setVisible] = useState(true);
  const { formId } = useParams();
  const { getQuantFormById } = useSuperAllianceApi();
  useEffect(() => {
    (async function () {
      if (formId) {
        await getQuantFormById(formId)
          .then((res) => {
            if (res == undefined) {
              setFormData("not found");
              return setVisible(false);
            }
            setFormData(res);
            setVisible(false);
          })
          .catch(() => null);
      }
    })();
  }, [formId, getQuantFormById]);
  return (
    <div className="pt-3 flex flex-col w-full justify-center items-center">
      <>
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition="slide-up" mounted={scroll.y > 0}>
            {(transitionStyles) => (
              <Button
                size="sm"
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                <IconArrowUp size={15} />
              </Button>
            )}
          </Transition>
        </Affix>
      </>

      {formData && (
        <>
          {formData == "not found" ? (
            <div className="text-red-500 text-4xl font-bold">
              Form not found!
            </div>
          ) : (
            <div className="w-full max-w-md p-10">
              <QuantFormView formData={formData} />
            </div>
          )}
        </>
      )}
      {!formData && (
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}
    </div>
  );
}

export default DataQuantStandForm;
