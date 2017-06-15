import * as $j from 'jquery'
import {
  Column,
  ColorNameToPriority,
  Task,
  TaskOwner,
  TaskPoints,
  TaskPriority,
  TaskTag
} from './models/task'

export class DomInterface {
  public static injectMainDiv(): JQuery {
    const mainDiv = $j('<div id="phabricatorPlus"></div>')
    $j('body').append(mainDiv)
    return mainDiv
  }

  public static parseTasks(): Task[] {
    const allTasks: Task[] = []
    $j('.phui-workpanel-view[data-sigil="workpanel"]')
      .toArray()
      .forEach((element: HTMLElement) => {
        const column = DomInterface.parseColumn($j(element))
        column.root
          .find('.phui-workpanel-body ul.phui-oi-list-view > li')
          .toArray()
          .forEach((taskDOM: HTMLElement) => {
            allTasks.push(DomInterface.parseTask(column, $j(taskDOM)))
          }, allTasks)
      }, [])
    return allTasks
  }

  private static parseColumn(column: JQuery): Column {
    return {
      root: column,
      actionList: column.find('.phui-header-action-list').first(),
      name: column.find('.phui-header-header').text(),
    }
  }

  private static parseTask(column: Column, task: JQuery): Task {
    const taskContent = task.find('.phui-oi-table-row')
    return {
      id: DomInterface.parseTaskId(taskContent),
      title: DomInterface.parseTaskTitle(taskContent),
      points: DomInterface.parseTaskPoints(taskContent),
      tags: DomInterface.parseTaskTags(taskContent),
      owner: DomInterface.parseTaskOwner(taskContent),
      priority: DomInterface.parseTaskPriority(task),
      column: column,
    }
  }

  private static parseTaskId(taskContent: JQuery): string {
    return taskContent.find('.phui-oi-objname').html()
  }

  private static parseTaskTitle(taskContent: JQuery): string {
    return taskContent.find('.phui-oi-link').html()
  }

  private static parseTaskPoints(taskContent: JQuery): TaskPoints | undefined {
    const dom = taskContent.find('.phui-workcard-points')
    const value = parseFloat(dom.text())
    return value ? {value, dom} : undefined
  }

  private static parseTaskTags(taskContent: JQuery): ReadonlyArray<TaskTag> {
    return taskContent.find('.phabricator-handle-tag-list li').toArray().map((tag: HTMLElement) => {
      const neutralized = $j(tag).clone()
      neutralized.attr('href', '')
      return {
        text: $j(tag).text(),
        dom: $j(tag),
        neutralizedDom: neutralized,
      }
    })
  }

  private static parseTaskOwner(taskContent: JQuery): TaskOwner | undefined {
    const owner = taskContent.find('.phui-link-person')
    if (owner.length > 0) {
      const neutralized = owner.clone()
      neutralized.attr('href', '')
      return {
        text: owner.text(),
        dom: owner,
        neutralizedDom: neutralized,
      }
    }
    return undefined
  }

  private static parseTaskPriority(task: JQuery): TaskPriority {
    const priorityColorName = task.attr('class')
      .split(' ')
      .filter((className) => className.indexOf('phui-oi-bar-color-') === 0)[0]
      .substring('phui-oi-bar-color-'.length)
    return ColorNameToPriority[priorityColorName]
  }
}
