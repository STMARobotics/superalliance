"use client";

import { getFormById } from "@/lib/superallianceapi";
import { Affix, Button, LoadingOverlay, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import FormView from "@/components/form-view";
import { useParams } from "react-router-dom";

function DataStandForm() {
  const [scroll, scrollTo] = useWindowScroll();
  const [formData, setFormData] = useState<any>(null);
  const [visible, setVisible] = useState(true);
  const { formId } = useParams();
  useEffect(() => {
    (async function () {
      if (formId) {
        await getFormById(formId)
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
  });
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
              <FormView formData={formData} />
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

export default DataStandForm;
