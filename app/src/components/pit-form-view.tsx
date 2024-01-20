import { Accordion } from "@mantine/core";

const classes = {
  root: `border-radius: var(--mantine-radius-sm); background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));`,
  item: `
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
  border: rem(1px) solid transparent;
  position: relative;
  z-index: 0;
  transition: transform 150ms ease;

  &[data-active] {
    transform: scale(1.03);
    z-index: 1;
    background-color: var(--mantine-color-body);
    border-color: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4));
    box-shadow: var(--mantine-shadow-md);
    border-radius: var(--mantine-radius-md);
  }
  `,
  chevron: `
  &[data-rotate] {
    transform: rotate(-90deg);
  }
  `,
};

const PitFormView = ({ pitFormData }: { pitFormData: any }) => {
  return (
    <>
      <Accordion
        maw={400}
        defaultValue={pitFormData.overallStrategy}
        classNames={classes}
      >
        <Accordion.Item
          key={pitFormData.overallStrategy}
          value={pitFormData.overallStrategy}
        >
          <Accordion.Control>{pitFormData.overallStrategy}</Accordion.Control>
          <Accordion.Panel>{pitFormData.overallStrategy}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default PitFormView;
