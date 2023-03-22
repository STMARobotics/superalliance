import { Table, Anchor, Group, ScrollArea, createStyles, Avatar } from '@mantine/core';
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

  highlighted: {
    backgroundColor: theme.colors[theme.primaryColor][5],
    color: 'white'
  },

  scrollArea: {
    width: '150vh'
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
    averageScore: string | number;
    bestAuto: string | number;
    bestTele: string | number;
    averageAutoScore: string | number;
    averageTeleScore: string | number;
    averageCones: string | number;
    averageCubes: string | number;
    averageHighCones: string | number;
    averageMidCones: string | number;
    averageLowCones: string | number;
    averageHighCubes: string | number;
    averageMidCubes: string | number;
    averageLowCubes: string | number;
    averageSinglePlayer: string | number;
    averageDoublePlayer: string | number;
    averageBothPlayer: string | number;
    averageTippedCones: string | number;
    averageFloorCones: string | number;
    totalCrits: string | number;
    rankPoints: string | number;
    defense: string | number;
  }[];
  selectedSort: string;
}

export function SortingTeamTable({ data, selectedSort }: TableReviewsProps) {

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
        <td className={cx({ [classes.highlighted]: selectedSort == '_id' })}>{row.teamName}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgScore' })}>{row.averageScore}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgAutoScore' })}>{row.averageAutoScore}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgTeleScore' })}>{row.averageTeleScore}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'BestAuto' })}>{row.bestAuto}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'BestTele' })}>{row.bestTele}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgCones' })}>{row.averageCones}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgCubes' })}>{row.averageCubes}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgHighCone' })}>{row.averageHighCones}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgMidCone' })}>{row.averageMidCones}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgLowCone' })}>{row.averageLowCones}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgHighCube' })}>{row.averageHighCubes}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgMidCube' })}>{row.averageMidCubes}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgLowCube' })}>{row.averageLowCubes}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgSinglePlayer' })}>{row.averageSinglePlayer}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgDoublePlayer' })}>{row.averageDoublePlayer}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgBothPlayer' })}>{row.averageBothPlayer}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgTippedCones' })}>{row.averageTippedCones}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgFloorCones' })}>{row.averageFloorCones}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'TotalCrit' })}>{row.totalCrits}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'RP' })}>{row.rankPoints}</td>
        <td className={cx({ [classes.highlighted]: selectedSort == 'AvgDefense' })}>{row.defense}</td>
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
            <th>Average Auto Score</th>
            <th>Average Teleop Score</th>
            <th>Best Auto Score</th>
            <th>Best Teleop Score</th>
            <th>Average Cones</th>
            <th>Average Cubes</th>
            <th>Average High Cones</th>
            <th>Average Mid Cones</th>
            <th>Average Low Cones</th>
            <th>Average High Cubes</th>
            <th>Average Mid Cubes</th>
            <th>Average Low Cubes</th>
            <th>Average Single HP</th>
            <th>Average Double HP</th>
            <th>Average Both HP</th>
            <th>Tipped Cones %</th>
            <th>Floor Cones %</th>
            <th>Total Criticals</th>
            <th>RP Average</th>
            <th>Defense %</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}