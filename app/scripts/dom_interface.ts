import * as $j from 'jquery'

export class DomInterface {
  public static injectMainDiv(): JQuery {
    const mainDiv = $j('<div id="phabricatorPlus"></div>')
    $j('body').append(mainDiv)
    return mainDiv
  }
}
