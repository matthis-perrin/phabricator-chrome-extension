import * as React from 'react'
import * as $j from 'jquery'

import {Task, TaskTag} from '../models/task'
import {SearchRangeWithSimilarity, SearchResult} from '../models/search'

interface PhabTaskRowProps {
  task: Task
  searchResult?: SearchResult
}

export class PhabTaskRow extends React.Component<PhabTaskRowProps, {}> {
  public static displayName = 'PhabTaskRow'

  private stringWithMatches(string: string, matchRange: SearchRangeWithSimilarity[]): string {
    if (!matchRange) {
      return string
    }
    let offset = 0
    for (let match of matchRange) {
      const highlightLevel = match.similarity >= 1 ? 5 : Math.min(5, match.length)
      const prefix = `<span class="highlight lvl${highlightLevel}">`
      const suffix = '</span>'
      const matchWrapperLength = prefix.length + suffix.length
      const startIndex = offset + match.index
      const endIndex = offset + match.index + match.length

      const start = string.substring(0, startIndex)
      const middle = string.substring(startIndex, endIndex)
      const end = string.substring(endIndex)

      offset += matchWrapperLength
      string = start + prefix + middle + suffix + end
    }
    return string
  }

  private replaceTextInDom(dom: JQuery, originalText: string, newHtml: string): JQuery {
    if (originalText === newHtml) {
      return dom
    }
    // Remove text
    dom.contents().filter(function (this: HTMLElement) {
      return this.nodeType === 3 && $j(this).get(0).textContent === originalText
    }).remove()
    // Replace with new dom
    dom.append(`<span>${newHtml}</span>`)
    return dom
  }

  render() {
    const task = this.props.task
    const matches = this.props.searchResult && this.props.searchResult.matches

    const idString = matches ? this.stringWithMatches(task.id, matches['id']) : task.id
    const titleString = matches ? this.stringWithMatches(task.title, matches['title']) : task.title

    // Add tags to the right elements
    const rightElements = task.tags.map<JSX.Element>((tag: TaskTag, i: number): JSX.Element => {
      const clonedDom = tag.dom.clone()
      if (matches) {
        const tagSpan = clonedDom.find(' > a > span')
        const tagString = this.stringWithMatches(tag.text, matches[`tags.${i}.text`])
        this.replaceTextInDom(tagSpan, tag.text, tagString)
      }
      return (
        <div
          className="phab-task-row__right__tag"
          key={`task-tag-${tag.text}`}
          dangerouslySetInnerHTML={{__html: clonedDom.html()}}
        ></div>
      )
    }).reverse()

    // Add the storypoints
    if (task.points && task.points.value !== null) {
      const points = (
        <div
          className="phab-task-row__right__tag phab-task-row__right__points"
          key="task-points"
          dangerouslySetInnerHTML={{__html: task.points.dom[0].outerHTML}}
        ></div>
      )
      rightElements.push(points)
    }

    // Add owner to the right elements
    if (task.owner) {
      const ownerString = matches ? this.stringWithMatches(task.owner.text, matches['owner.text']) : task.owner.text
      const ownerHtml = this.replaceTextInDom(task.owner.dom.clone(), task.owner.text, ownerString)[0].outerHTML
      const owner = (
        <div
          className="phab-task-row__right__owner"
          key="task-owner"
          dangerouslySetInnerHTML={{__html: ownerHtml}}
        ></div>
      )
      rightElements.push(owner)
    }

    return (
      <div className="phab-task-row">
        <div className="phab-task-row__left">
          <div className="phab-task-row__left__id" dangerouslySetInnerHTML={{__html: idString}}></div>
        </div>
        <div className="phab-task-row__middle">
          <div className="phab-task-row__middle__title" dangerouslySetInnerHTML={{__html: titleString}}></div>
        </div>
        <div className="phab-task-row__right">{rightElements}</div>
      </div>
    )
  }

}
