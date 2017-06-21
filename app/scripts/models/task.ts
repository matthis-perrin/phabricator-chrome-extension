interface TaskDOM {
  readonly text: string
  readonly dom: JQuery
  readonly neutralizedDom: JQuery
}

export interface TaskPriority {
  readonly value: number
  readonly label: string
  readonly colorName: string
  readonly colorHex: string
}

export interface TaskTag extends TaskDOM {}

export interface TaskOwner extends TaskDOM {}

export interface TaskPoints {
  value: number
  dom: JQuery
}

export interface Column {
  name: string
  root: JQuery
  actionList: JQuery
}

export interface Task {
  readonly id: string
  readonly title: string
  readonly points?: TaskPoints
  readonly tags: ReadonlyArray<TaskTag>
  readonly owner?: TaskOwner
  readonly priority: TaskPriority
  readonly column: Column
}


export const Priorities: {[key: string]: TaskPriority} = {
  UNBREAK_NOW: { value: 0, label: 'Unbreak Now', colorName: 'pink',   colorHex: '#da49be'},
  BLOCKER:     { value: 1, label: 'Blocker',     colorName: 'violet', colorHex: '#8e44ad'},
  HIGH:        { value: 2, label: 'High',        colorName: 'red',    colorHex: '#c0392b'},
  MEDIUM:      { value: 3, label: 'Medium',      colorName: 'orange', colorHex: '#e67e22'},
  LOW:         { value: 4, label: 'Low',         colorName: 'yellow', colorHex: '#f1c40f'},
  WISH_LIST:   { value: 5, label: 'Wish list',   colorName: 'sky',    colorHex: '#3498db'},
  NEED_TRIAGE: { value: 6, label: 'Need triage', colorName: 'grey',   colorHex: '#92969D'},
}

export const ColorNameToPriority: {[color: string]: TaskPriority} = Object.keys(Priorities)
  .reduce((map, priorityKey) => {
    const taskPriority = Priorities[priorityKey]
    map[taskPriority.colorName] = taskPriority
    return map
  }, {} as {[color: string]: TaskPriority})
