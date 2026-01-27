import TimeLineComponent from '../components/about/timeLineComponent'
import todoListData from '../assets/data/todos.json'
import PageHead from '../components/about/pageHead'

export default function TimeLine() {
    return (
        <>
            <PageHead title="TimeLine" />
            <TimeLineComponent todoListItems={todoListData.data} />
        </>
    )
}
