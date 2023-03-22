import { useEffect, useMemo, useState } from "react";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import VisualsGraphsComponent from "../Components/VisualsComponents/VisualsGraphs";
import { VisualsNavbar } from "../Components/VisualsNavbar";
import GetTeamData from "../Utils/GetTeamData";
import { Accordion, Checkbox, createStyles, Flex, Group, ScrollArea, Select, Table, Text, TextInput, useMantineTheme } from "@mantine/core"
import EventSelectStyles from "../Styles/EventSelectStyles";
import { useListState, useLocalStorage } from "@mantine/hooks";
import { IconCircleNumber1, IconGripVertical } from "@tabler/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import InspectorComponent from "../Modules/ExtendedComponents/InspectorComponent";

const useStyles = createStyles((theme) => ({
    item: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    dragHandle: {
        ...theme.fn.focusStyles(),
        width: "40px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[1]
    },
}));

function VisualsGraphs() {

    const baseKeys = ["AvgScore", "AvgTeleScore", "AvgAutoScore"]

    const { classes, cx } = useStyles();
    const [state, handlers] = useListState<any>(baseKeys);
    const [averageData, setAverageData] = useState([])
    const [selectedSortTeams, setSelectedSortTeams] = useState("AvgScore")
    const [selectedDirectionTeams, setSelectedDirectionTeams] = useState("-1")
    const [keys, setKeys] = useState<string[]>(baseKeys);
    const [limit, setLimit] = useState('0')

    const [dragging, setDragging] = useState(false);

    const eventSelectClasses = EventSelectStyles().classes

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    const items = state.map((item: any, index: any) => (
        <Draggable key={item} index={index} draggableId={item} isDragDisabled={dragging}>
            {(provided, snapshot) => (
                <tr className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })} ref={provided.innerRef} {...provided.draggableProps}>
                    <td>
                        <div className={classes.dragHandle} {...provided.dragHandleProps}>
                            <IconGripVertical size="1.05rem" stroke={1.5} />
                        </div>
                    </td>
                    <td style={{ width: "100%" }}>{item}</td>
                </tr>
            )}
        </Draggable>
    ));

    const sortFieldsTeams = [
        {
            label: "Average Score",
            value: "AvgScore"
        },
        {
            label: "Average Auto Score",
            value: "AvgAutoScore"
        },
        {
            label: "Average Teleop Score",
            value: "AvgTeleScore"
        },
        {
            label: "Best Auto Score",
            value: "BestAuto"
        },
        {
            label: "Best Teleop Score",
            value: "BestTele"
        },
        {
            label: "Average Cones",
            value: "AvgCones"
        },
        {
            label: "Average Cubes",
            value: "AvgCubes"
        },
        {
            label: "Average High Cones",
            value: "AvgHighCone"
        },
        {
            label: "Average Mid Cones",
            value: "AvgMidCone"
        },
        {
            label: "Average Low Cones",
            value: "AvgLowCone"
        },
        {
            label: "Average High Cubes",
            value: "AvgHighCube"
        },
        {
            label: "Average Mid Cubes",
            value: "AvgMidCube"
        },
        {
            label: "Average Low Cubes",
            value: "AvgLowCube"
        },
        {
            label: "Average Single HP Chosen",
            value: "AvgSinglePlayer"
        },
        {
            label: "Average Double HP Chosen",
            value: "AvgDoublePlayer"
        },
        {
            label: "Average Both HP Chosen",
            value: "AvgBothPlayer"
        },
        {
            label: "Total Criticals",
            value: "TotalCrit"
        },
        {
            label: "Average RP Per Match",
            value: "RP"
        },
    ]

    const sortDirectionFields = [
        {
            label: "Highest -> Lowest",
            value: "-1"
        },
        {
            label: "Lowest -> Highest",
            value: "1"
        }
    ]

    const getEventCode = async () => {
        var eventArray: any[] = [];
        eventArray.push({
            label: "All Events",
            value: "all"
        })
        eventArray.push({
            label: "Testing Event",
            value: "testing",
            shortCode: "testing"
        })
        eventArray.push({
            label: "Week 0 Event",
            value: "week0",
            shortCode: "week0"
        })
        const eventdata = await GetTeamData.getTeamEventDataLanding(7028, 2023)
        eventdata.data.map((event: any) => {
            eventArray.push(event)
        })
        try {
            if (preferenceData.dataShow == 'testing') return 'testing'
            if (preferenceData.dataShow == 'week0') return 'week0'
            const d = eventArray.filter((e: any) => {
                return e.value == preferenceData.dataShow
            })[0]
            return d.eventcode
        } catch {
            return ""
        }
    }

    useEffect(() => {
        sortTeams()
    }, [selectedSortTeams, selectedDirectionTeams, limit])

    useEffect(() => {
        handlers.setState(keys)
    }, [keys])

    useEffect(() => {
        setDragging(false)
    }, [state])

    const sortTeams = () => {
        (async function () {
            if (preferenceData.dataShow !== 'all') {
                const data = await GetTeamData.getAllTeamsSortedEvent(await getEventCode(), selectedSortTeams, selectedDirectionTeams)
                return setAverageData(Number(limit) == 0 ? data.data : data.data.slice(0, Number(limit)))
            }
            const data = await GetTeamData.getAllTeamsSorted(selectedSortTeams, selectedDirectionTeams)
            return setAverageData(Number(limit) == 0 ? data.data : data.data.slice(0, Number(limit)))
        })()
    }

    const theme = useMantineTheme()

    return (

        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <VisualsNavbar
                    pageIndex="Graphs" />
                <div className="SubmissionsHomeContent">

                    <Text
                        className="SubmissionsEventMatchesText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Teams Graph
                    </Text>

                    <div style={{
                        paddingBottom: '25px'
                    }} className="SortingSelectGroup">
                        <Select
                            transition={'pop-top-left'}
                            transitionDuration={80}
                            transitionTimingFunction={'ease'}
                            dropdownPosition="bottom"
                            style={{ zIndex: 20 }}
                            data={sortFieldsTeams}
                            placeholder="Sort by..."
                            label="Sorting Field"
                            classNames={eventSelectClasses}
                            value={selectedSortTeams}
                            onChange={(event: string) => {
                                setSelectedSortTeams(event)
                            }}
                        />
                        <Select
                            transition={'pop-top-left'}
                            transitionDuration={80}
                            transitionTimingFunction={'ease'}
                            dropdownPosition="bottom"
                            style={{ zIndex: 10 }}
                            data={sortDirectionFields}
                            placeholder="Up or down?"
                            label="Direction"
                            classNames={eventSelectClasses}
                            value={selectedDirectionTeams}
                            onChange={(event: string) => {
                                setSelectedDirectionTeams(event)
                            }}
                        />
                        <TextInput
                            label={"Limit Results"}
                            icon={<IconCircleNumber1 />}
                            placeholder="Limit number..."
                            value={limit}
                            onChange={(event) => {
                                setLimit(event.currentTarget.value)
                            }}
                        />
                    </div>

                    <Accordion pb={25} w="100%">
                        <Accordion.Item value="legendpoints">
                            <Accordion.Control>Legend Points</Accordion.Control>
                            <Accordion.Panel>
                                <Flex
                                    gap="md"
                                    justify="center"
                                    align="center"
                                    direction={{ base: 'column', sm: 'row' }}
                                    wrap="nowrap">
                                    <Checkbox.Group value={keys} onChange={setKeys}>
                                        {sortFieldsTeams.map((sort: any, index: any) => (
                                            <Checkbox key={index + 1} value={sort.value} label={sort.label} />
                                        ))}
                                    </Checkbox.Group>
                                    <DragDropContext
                                        onDragEnd={({ destination, source }) =>
                                            handlers.reorder({ from: source.index, to: destination?.index || 0 })
                                        }
                                        onDragStart={() => setDragging(true)}
                                    >
                                        <Table sx={{ '& tbody tr td': { borderBottom: 0 } }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "40px" }} />
                                                    <th style={{ width: "80px" }}>Point (Highest = Lowest on Graph)</th>
                                                </tr>
                                            </thead>
                                            <Droppable key='dnd-list' droppableId="dnd-list" direction="vertical">
                                                {(provided) => (
                                                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                                        {items}
                                                        {provided.placeholder}
                                                    </tbody>
                                                )}
                                            </Droppable>
                                        </Table>
                                    </DragDropContext>
                                </Flex>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>

                    {averageData.length !== 0 && (
                        <VisualsGraphsComponent
                            data={averageData}
                            keys={state} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default VisualsGraphs