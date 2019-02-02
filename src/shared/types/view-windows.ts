export enum ViewWindow {
    AllTime = 'AllTime',
    ThisYear = 'ThisYear',
    LastYear = 'LastYear',
    LastMonth = 'LastMonth',
    ThisMonth = 'ThisMonth',
    LastWeek = 'LastWeek',
    ThisWeek = 'ThisWeek',
    LastTwoWeeks = 'LastTwoWeeks',
}

export const ViewWindowOptions = [
    { value: ViewWindow.AllTime, label: 'All Time' },
    { value: ViewWindow.ThisYear, label: 'This Year' },
    { value: ViewWindow.ThisMonth, label: 'This Month' },
    { value: ViewWindow.ThisWeek, label: 'This Week' },
    { value: ViewWindow.LastTwoWeeks, label: 'Last Two Weeks' },
    { value: ViewWindow.LastMonth, label: 'Last Month' },
    { value: ViewWindow.LastYear, label: 'Last Year' },
    { value: ViewWindow.LastWeek, label: 'Last Week' },
];
