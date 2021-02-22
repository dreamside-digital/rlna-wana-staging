import { CONTENT_MAP, SECTION_MAP } from "../utils/constants.js"
import { cloneDeep } from 'lodash'


export const adminTools = (state={users: [], browserNotifications: {}}, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return { ...state, isLoggedIn: true, user: action.user }
    case 'LOCK_FAILURE':
      return { ...state, isLoggedIn: false, error: action.err }
    case 'USER_LOGGED_OUT':
      return { ...state, isLoggedIn: false, isEditingPage: false }
    case 'TOGGLE_EDITING':
      return { ...state, isEditingPage: !state.isEditingPage }
    case 'TOGGLE_NEW_PAGE_MODAL':
      return { ...state, showNewPageModal: !state.showNewPageModal, options: action.options }
    case 'GRANT_ACCESS':
      return { ...state, accessGranted: true }
    case 'SET_USERS':
      return { ...state, users: action.users }
    case 'SET_ACCESS_CODE':
      return { ...state, accessCode: action.accessCode }
    case 'SET_BROWSER_NOTIFICATIONS':
      return { ...state, browserNotifications: action.notifications }
    default:
      return state
  }
}

export const notifications = (state={}, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        message: action.message,
        color: action.color
      }
    case 'CLOSE_NOTIFICATION':
      return {
          ...state,
          message: null,
          color: null
      }
    default:
      return state
  }
}

export const navigation = (state={ currentLang: "en" }, action) => {
  switch (action.type) {
    case 'OPEN_MENU':
      return {
        ...state,
        showMenu: true
      }
    case 'CLOSE_MENU':
      return {
        ...state,
        showMenu: false
      }
    case 'TOGGLE_MENU':
      return {
        ...state,
        showMenu: !state.showMenu
      }

    case 'SET_CURRENT_LANG':
      return {
        ...state,
        currentLang: action.currentLang
      }
    default:
      return state
  }
}

export const page = (state={}, action) => {
  let newSectionArr, newSection, emptyContentItem, newContentItem;
  switch (action.type) {
    case 'LOAD_PAGE_DATA':
      return {
        ...state,
        data: action.data
      }
    case 'UPDATE_PAGE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            [action.contentId]: action.content
          }
        }
      }

    case 'UPDATE_PAGE_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: action.value
        }
      }

    case 'UPDATE_PAGE_TITLE':
      return {
        ...state,
        data: {
          ...state.data,
          title: action.title
        }
      }

    case 'UPDATE_PAGE_HEADER_IMAGE':
      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            headerImage: action.content
          }
        }
      }

    case 'ADD_SECTION':
      newSectionArr = [...state.data.content.sections];
      newSection = cloneDeep(SECTION_MAP[action.sectionType]);
      newSectionArr.splice((action.sectionIndex + 1), 0, newSection);
      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'DELETE_SECTION':
      newSectionArr = [...state.data.content.sections];
      newSectionArr.splice(action.sectionIndex, 1);

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }
    case 'DUPLICATE_SECTION':
      newSectionArr = [...state.data.content.sections];
      const contentSection = state.data.content.sections[action.sectionIndex];
      const duplicateSection = cloneDeep(contentSection)
      newSection = { ...newSectionArr[action.sectionIndex] }
      newSectionArr.splice(action.sectionIndex, 0, duplicateSection);

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'EDIT_SECTION_TAG':
      newSection = { ...state.data.content.sections[action.sectionIndex] }
      newSection.tag = action.tag
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'ADD_CONTENT_ITEM':
      newSection = { ...state.data.content.sections[action.sectionIndex] }
      emptyContentItem = CONTENT_MAP[action.contentType];
      newSection.content ? newSection.content.push(emptyContentItem) : newSection.content = [emptyContentItem]
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'UPDATE_CONTENT_ITEM':
      newSection = { ...state.data.content.sections[action.sectionIndex] }
      newContentItem = { ...newSection.content[action.contentIndex], content: action.content }
      newSection.content.splice(action.contentIndex, 1, newContentItem);
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'DELETE_CONTENT_ITEM':
      newSection = { ...state.data.content.sections[action.sectionIndex] }
      newSection.content.splice(action.contentIndex, 1);
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'ADD_SIDEBAR_CONTENT':
      newSection = { ...state.data.content.sections[action.sectionIndex] }
      emptyContentItem = CONTENT_MAP[action.contentType];
      newSection.sidebar = emptyContentItem;
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'UPDATE_SIDEBAR_CONTENT':
      newSection = {...state.data.content.sections[action.sectionIndex] }
      newSection.sidebar.content = action.content
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'DELETE_SIDEBAR_CONTENT':
      newSection = { ...state.data.content.sections[action.sectionIndex] }
      delete newSection.sidebar;
      newSectionArr = [...state.data.content.sections]
      newSectionArr.splice(action.sectionIndex, 1, newSection)

      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            sections: newSectionArr
          }
        }
      }

    case 'UPDATE_FOOTNOTE':
      return {
        ...state,
        data: {
          ...state.data,
          footnotes: {
            ...state.data.footnotes,
            [action.id]: action.footnote
          }
        }
      }

    case 'SET_FOOTNOTES':
      return {
        ...state,
        data: {
          ...state.data,
          footnotes: action.footnotes
        }
      }

    case 'UPDATE_DEFINITION':
      return {
        ...state,
        data: {
          ...state.data,
          definitions: {
            ...state.data.definitions,
            [action.id]: action.definition
          }
        }
      }

    case 'SET_DEFINITIONS':
      return {
        ...state,
        data: {
          ...state.data,
          definitions: action.definitions
        }
      }

    case 'UPDATE_PAGE_CONTENT':
      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            [action.location]: {
              ...state.data.content[action.location],
              ...action.content
            }
          }
        }
      }

    case 'SET_PAGE_CONTENT':
      return {
        ...state,
        data: {
          ...state.data,
          content: {
            ...state.data.content,
            [action.location]: action.content
          }
        }
      }

    default:
      return state
  }
}


export const profiles = (state={profiles: {}}, action) => {
  switch (action.type) {
    case 'SET_PROFILES':
      return {
        ...state,
        profiles: action.profiles
      }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [action.profile.id]: action.profile
        }
      }
    default:
      return state
  }
}


export const events = (state={events: {}}, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.events
      }

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: {
          ...state.events,
          [action.event.id]: action.event
        }
      }
    default:
      return state
  }
}

export const materials = (state={materials: {}}, action) => {
  switch (action.type) {
    case 'SET_MATERIALS':
      return {
        ...state,
        materials: action.materials
      }

    case 'UPDATE_MATERIAL':
      return {
        ...state,
        materials: {
          ...state.materials,
          [action.material.id]: action.material
        }
      }
    default:
      return state
  }
}


export const categories = (state={ categories: {}}, action) => {
  switch (action.type) {
    case 'SELECT_CATEGORY':
      return {
        ...state,
        selected: action.selected
      }
    case 'UNSELECT_CATEGORY':
      return {
        ...state,
        selected: null,
      }

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.category.id]: action.category
        }
      }

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
      }
    default:
      return state
  }
}

export const pages = (state={ pages: {}}, action) => {
  switch (action.type) {
    case 'SET_PAGES':
      return {
        ...state,
        pages: action.pages
      }
    case 'SET_ORDERED_PAGES':
      return {
        ...state,
        orderedPages: action.orderedPages
      }
    default:
      return state
  }
}

export const translations = (state={}, action) => {
  switch (action.type) {
    case 'SET_TRANSLATIONS':
      return {
        ...action.strings
      }
    case "UPDATE_TRANSLATION_STATE":
      return {
        ...state,
        [action.translation.id]: action.translation
      }
    default:
      return state
  }
}

export const appReducers = (state = {}, action) => {
  return {
    notifications: notifications(state.notifications, action),
    adminTools: adminTools(state.adminTools, action),
    navigation: navigation(state.navigation, action),
    page: page(state.page, action),
    profiles: profiles(state.profiles, action),
    events: events(state.events, action),
    materials: materials(state.materials, action),
    pages: pages(state.pages, action),
  }
}

