import TimeLineComponent from '../components/about/timeLineComponent'
import todoListData from '../assets/data/todos.json'

export default function TimeLine() {
    return (
        <>
            <div className="text-base-content/50 w-full text-xs">
                <p className="before:content-['#TimeLine']"></p>
                <div className="divider my-1"></div>
            </div>
            <TimeLineComponent todoListItems={todoListData.data} />
        </>
    )
}
