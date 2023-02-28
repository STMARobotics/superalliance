import { Table, Anchor, Text, Group, ScrollArea, createStyles, Avatar } from '@mantine/core';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    zIndex: 2,
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
    },
  },

  stickyColumn: {
    position: 'sticky',
    zIndex: 1,
    left: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    width: "14%",

    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        } !important`,
    },
  },

  scrollArea: {
    height: 400,
    width: "100%"
  },

  scrolled: {
    boxShadow: `${theme.shadows.sm}`,
  },
}));

interface TableReviewsProps {
  data: {
    avatar: string;
    teamNumber: number;
    teamName: string;
    averageScore: string;
    autoScore: string;
    teleopScore: string;
    averageWeight: string;
    selectedSort: string;
  }[];
}

export function SortingTeamTable({ data }: TableReviewsProps) {

  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row) => {

    return (
      <tr key={row.teamNumber}>

        <td className={cx(classes.stickyColumn)}>
          <Group spacing="sm">
            <Avatar size={26} src={row.avatar} radius={26} />
            <Anchor<'a'> href={`/submissions/teams/${row.teamNumber}`} target={"_blank"} size="sm">
              {row.teamNumber}
            </Anchor>
          </Group>
        </td>
        <td>{row.teamName}</td>
        <td>{row.averageScore}</td>
        <td>{row.autoScore}</td>
        <td>{row.teleopScore}</td>
        <td>{row.averageWeight}</td>
      </tr>
    );
  });

  return (
    <ScrollArea className={classes.scrollArea} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table sx={{ minWidth: 700 }}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th className={classes.stickyColumn}>Team Number</th>
            <th>Team Name</th>
            <th>Average Score</th>
            <th>Auto Score</th>
            <th>Teleop Score</th>
            <th>Average Weight</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}