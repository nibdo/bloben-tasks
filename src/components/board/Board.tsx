import './Board.scss';
import { CalDavCalendar, ReduxState } from '../../types/interface';
import { CalDavTask } from '../../bloben-interface/calDavTask/calDavTask';
import { CalDavTaskSettings } from '../../bloben-interface/calDavTaskSettings/CalDavTaskLabel';
import { find } from 'lodash';
import { useSelector } from 'react-redux';
import BoardColumn from '../boardColumn/BoardColumn';

const renderBoardColumns = (
  calDavTasks: CalDavTask[],
  calendar: CalDavCalendar,
  settings: CalDavTaskSettings[]
) => {
  const calendarID = calendar.id;
  // filter for only calendar tasks
  const calendarTasks = calDavTasks.filter(
    (item) => item.calendarID === calendarID
  );

  const taskSettings = find(settings, (item) => item.calendarID === calendarID);

  return (
    <BoardColumn
      calendarID={calendarID}
      tasks={calendarTasks}
      title={calendar.displayName}
      settings={taskSettings}
    />
  );
};

interface BoardProps {
  calendar: CalDavCalendar;
}
const Board = (props: BoardProps) => {
  const { calendar } = props;

  const calDavTasks: CalDavTask[] = useSelector(
    (state: ReduxState) => state.calDavTasks
  );
  const calDavTaskSettings: CalDavTaskSettings[] = useSelector(
    (state: ReduxState) => state.calDavTaskSettings
  );
  const renderedBoardColumns = renderBoardColumns(
    calDavTasks,
    calendar,
    calDavTaskSettings
  );

  return <div className={'Board__container'}>{renderedBoardColumns}</div>;
};

export default Board;
