import axios from "axios";
import firebase from "../firebase/init";
import { copyContentFromStaging } from "../firebase/operations"
import { NOTIFICATION_MESSAGES } from "../utils/constants";


// AUTHENTICATION ------------------------

export function userLoggedIn(user = null) {
  return { type: "USER_LOGGED_IN", user };
}

export function userLoggedOut() {
  return { type: "USER_LOGGED_OUT" };
}

export function deleteAccount(user) {
  return (dispatch, getState) => {
    if (typeof window !== 'undefined')  {
      if (!window.confirm("Are you sure you want to permanently delete your account?")) {
        return false
      }

      const db = firebase.database();
      const user = firebase.auth().currentUser;
      console.log("user", user)

      db.ref(`users/${user.uid}`).set(null, error => {
        if (error) {
          console.log('FIREBASE ERROR', error)
          return dispatch(
            showNotification(
              `There was an error deleting your account. Please contact the website administrator.`,
              "error"
            )
          );
        }

        user.delete().then(() => {
          dispatch(showNotification('Your account has been deleted.'))
        }).catch(function(error) {
          dispatch(showNotification('There was an error deleting your account. Please contact the website administrator.'))
        });
      });
    }
  }
}

export function validateAccessCode(code) {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`access_code`)
      .once('value')
      .then(snap => {
        const correctCode = snap.val()

        if (code === correctCode) {
          dispatch(grantAccess());
          dispatch(showNotification(`Welcome!`));
        } else {
          dispatch(showNotification('That is not the correct access code. Please try again.'));
        }
      })
      .catch(error => {
        console.log("Error getting access code", error)
      })
  };
}

export function grantAccess() {
  return { type: 'GRANT_ACCESS' }
}

// NOTIFICATIONS ------------------------

export function showNotification(message, color="success") {
  return { type: "SHOW_NOTIFICATION", message, color };
}

export function closeNotification() {
  return { type: "CLOSE_NOTIFICATION" };
}

export function showNotificationByName(name) {
  return dispatch => {
    const message = NOTIFICATION_MESSAGES[name];
    dispatch( (message, "success"));
  };
}

// PAGE EDITING ------------------------

export function updateSectionContent(sectionIndex, contentIndex, newContent) {
  return {
    type: "UPDATE_SECTION_CONTENT",
    sectionIndex,
    contentIndex,
    newContent
  };
}

export function addSection(sectionIndex, sectionType="default") {
  return { type: "ADD_SECTION", sectionIndex, sectionType };
}

export function duplicateSection(sectionIndex) {
  return { type: "DUPLICATE_SECTION", sectionIndex };
}

export function deleteSection(sectionIndex) {
  return { type: "DELETE_SECTION", sectionIndex };
}

export function addContentItem(sectionIndex, contentType) {
  return { type: "ADD_CONTENT_ITEM", sectionIndex, contentType };
}

export function updateContentItem(sectionIndex, contentIndex, content) {
  return { type: "UPDATE_CONTENT_ITEM", sectionIndex, contentIndex , content};
}

export function deleteContentItem(sectionIndex, contentIndex) {
  return { type: "DELETE_CONTENT_ITEM", sectionIndex, contentIndex };
}

export function editSectionTag(sectionIndex, tag) {
  return { type: "EDIT_SECTION_TAG", sectionIndex, tag };
}

export function addSidebarContent(sectionIndex, contentType) {
  return { type: "ADD_SIDEBAR_CONTENT", sectionIndex, contentType };
}

export function updateSidebarContent(sectionIndex, content) {
  return { type: "UPDATE_SIDEBAR_CONTENT", sectionIndex, content};
}

export function deleteSidebarContent(sectionIndex) {
  return { type: "DELETE_SIDEBAR_CONTENT", sectionIndex };
}

export function toggleNewPageModal(options) {
  return { type: "TOGGLE_NEW_PAGE_MODAL", options };
}

export function updatePageTitle(title) {
  return { type: "UPDATE_PAGE_TITLE", title };
}

export function updatePageHeaderImage(content) {
  return { type: "UPDATE_PAGE_HEADER_IMAGE", content };
}

export function updateFootnote(id, footnote) {
  return { type: "UPDATE_FOOTNOTE", id, footnote }
}

export function setFootnotes(footnotes) {
  return { type: "SET_FOOTNOTES", footnotes }
}

export function updatePageContentState(location, content) {
  return { type: "UPDATE_PAGE_CONTENT", location, content };
}

export function setPageContentState(location, content) {
  return { type: "SET_PAGE_CONTENT", location, content };
}

export function saveFootnote(footnoteId, footnote) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const pageId = getState().page.data.id;

    db.ref(`pages/${pageId}/footnotes/${footnoteId}`).update(footnote, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      }

      dispatch(updateFootnote(footnoteId, footnote));
      dispatch(
        showNotification(
          "Your changes have been saved.",
          "success"
        )
      );
    })
  };
}

export function removeFootnote(footnoteId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();
    const pageId = state.page.data.id;

    db.ref(`pages/${pageId}/footnotes/`).update({[footnoteId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      let allFootnotes = { ...state.page.data.footnotes };
      delete allFootnotes[footnoteId];

      dispatch(setFootnotes(allFootnotes));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}

// ---------- Profiles

export function fetchProfiles() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`profiles`)
      .once('value')
      .then(snap => {
        dispatch(setProfiles(snap.val()));
      })
      .catch(error => {
        console.log("Error fetching profiles", error)
      })
  };
}

export function updateProfile(id, profile) {
  return { type: "UPDATE_PROFILE", id, profile }
}

export function setProfiles(profiles) {
  console.log({profiles})
  return { type: "SET_PROFILES", profiles }
}

export function saveProfile(profileId, profile) {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`profiles/${profileId}`).update(profile, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      }

      dispatch(updateProfile(profileId, profile));
      dispatch(
        showNotification(
          "Your changes have been saved.",
          "success"
        )
      );
    })
  };
}

export function removeProfile(profileId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();

    db.ref(`profiles/`).update({[profileId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      let allProfiles = { ...state.page.data.profiles };
      delete allProfiles[profileId];

      dispatch(setProfiles(allProfiles));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}

// ---------- Events

export function fetchEvents() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`events`)
      .once('value')
      .then(snap => {
        dispatch(setEvents(snap.val()));
      })
      .catch(error => {
        console.log("Error fetching events", error)
      })
  };
}

export function updateEvent(id, event) {
  return { type: "UPDATE_EVENT", id, event }
}

export function setEvents(events) {
  console.log({events})
  return { type: "SET_EVENTS", events }
}

export function saveEvent(eventId, event) {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`events/${eventId}`).update(event, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      }

      dispatch(updateEvent(eventId, event));
      dispatch(
        showNotification(
          "Your changes have been saved.",
          "success"
        )
      );
    })
  };
}

export function removeEvent(eventId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();

    db.ref(`events/`).update({[eventId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      let allEvents = { ...state.page.data.events };
      delete allEvents[eventId];

      dispatch(setEvents(allEvents));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}

// -----------------

export function savePage(pageData, pageId) {
  return dispatch => {
    const db = firebase.database();
    db
      .ref(`pages/${pageId}/`)
      .update(pageData)
      .then(snap => {
        dispatch(toggleNewPageModal());
        dispatch(
          showNotification(
            "Your page has been saved. Publish your changes to view and edit the page.",
            "success"
          )
        );
      });
  };
}


// rename to updateContent
export function updatePage(pageId, contentId, content) {
  return dispatch => {
    const db = firebase.database();

    db.ref(`pages/${pageId}/content/${contentId}/`).update(content, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      dispatch(updatePageData(contentId, content));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    });
  };
}

export function updateTitle(title) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const pageId = getState().page.data.id;

    db.ref(`pages/${pageId}/`).update({ title }, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      dispatch(updatePageTitle(title));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    });
  };
}

export function updateHeaderImage(content) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const pageId = getState().page.data.id;

    db.ref(`pages/${pageId}/content/`).update({ "headerImage": content }, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      dispatch(updatePageHeaderImage(content));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    });
  };
}

export function updateFirebaseData(updates, callback=null, notification="Your changes have been saved. Publish your changes to make them public.") {
  return (dispatch, getState) => {
    const db = firebase.database();
    console.log(updates)

    db.ref().update(updates, error => {
      if (error) {
        console.log('FIREBASE ERROR', error)
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      if (callback) {
        callback()
      } else {

      }

      dispatch(
        showNotification(
          notification,
          "success"
        )
      );
    });
  };
}

export function pushContentItem(location, content) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const pageId = getState().page.data.id;
    const newKey = db.ref(`pages/${pageId}/content/${location}/`).push().key;
    const newItem = { [newKey]: content }

    db.ref(`pages/${pageId}/content/${location}/`).update(newItem, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      dispatch(updatePageContentState(location, newItem));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}

export function removeContentItem(location, itemId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();
    const pageId = state.page.data.id;

    db.ref(`pages/${pageId}/content/${location}/`).update({[itemId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      const newContent = { ...state.page.data.content[location] }
      delete newContent[itemId]

      dispatch(setPageContentState(location, newContent));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}

export function savePageContent(innerFunction) {
  return (dispatch, getState) => {
    Promise.resolve(dispatch(innerFunction)).then(() => {
      const content = getState().page.data.content;
      const pageId = getState().page.data.id;

      console.log("content", content)
      console.log("pageId", pageId)

      const db = firebase.database();

      db.ref(`pages/${pageId}/content/`)
        .update(content)
        .then(res => {
          console.log('res', res)
          dispatch(
            showNotification(
              "Your changes have been saved. Publish your changes to make them public.",
              "success"
            )
          );
        })
        .catch(error => {
          console.log('error', error)
          return dispatch(
            showNotification(
              `There was an error saving your changes: ${error}`,
              "success"
            )
          );
        })
    });
  };
}

export function deploy() {
  return dispatch => {
    const url = `${process.env.GATSBY_DEPLOY_ENDPOINT}`;
    console.log(`Deploy command sent to ${url}`);

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(token => {
        return axios({
          method: "POST",
          url: url,
          headers: { Authorization: "Bearer " + token }
        });
      })
      .then(res => {
        console.log(res);
        if (res.data.status === "ok") {
          dispatch(
            showNotification(
              res.data.message,
              "success"
            )
          );
        } else {
          dispatch(
            showNotification(
              `There was an error deploying the site: ${res.data.message}`,
              "danger"
            )
          );
        }
      })
      .catch(err => {
        dispatch(
          showNotification(
            `There was an error deploying the site: ${err}`,
            "danger"
          )
        );
      });
  };
}

export function deployWithStagingContent() {
  return dispatch => {
    copyContentFromStaging()
      .then(() => {
        dispatch(
          showNotification(
            "Your content has been copied from the staging site.",
            "success"
          )
        );
        dispatch(deploy())
      })
      .catch(err => {
        dispatch(
          showNotification(
            `There was an error copying the content from the staging site: ${err}`,
            "danger"
          )
        );
      })
  }
}

export function loadPageData(data) {
  return { type: "LOAD_PAGE_DATA", data };
}

export function updatePageData(contentId, content) {
  return { type: "UPDATE_PAGE_DATA", contentId, content };
}

export function updatePageField(field, value) {
  return { type: "UPDATE_PAGE_FIELD", field, value };
}

export function setPages(pages) {
  return { type: "SET_PAGES", pages }
}

export function setOrderedPages(orderedPages) {
  return { type: "SET_ORDERED_PAGES", orderedPages }
}

export function fetchPages() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`pages`)
      .once('value')
      .then(snap => {
        const pages = Object.entries(snap.val()).reduce((obj, [id, page]) => {
          obj[id] = {...page, id}
          return obj
        }, {})

        console.log("Fetched pages", pages)
        dispatch(setPages(pages));
      })
      .catch(error => {
        console.log("Error fetching pages", error)
      })
  };
}

export function toggleEditing() {
  return (dispatch, getState) => {
    const db = firebase.database();
    const pageId = getState().page.data.id;

    db.ref(`pages/${pageId}`)
      .once('value')
      .then(snap => {
        const page = { ...snap.val(), id: pageId }

        console.log("Fetched page", page)
        dispatch(loadPageData(page));
        dispatch(toggleEditingState())
      })
      .catch(error => {
        console.log("Error fetching pages", error)
      })
  };
}

export function toggleEditingState() {
  return { type: "TOGGLE_EDITING" };
}



// NAVIGATION ------------------------

export function openMenu() {
  return { type: "OPEN_MENU" };
}

export function closeMenu() {
  return { type: "CLOSE_MENU" };
}

export function toggleMenu() {
  return { type: "TOGGLE_MENU" };
}

export function setCurrentLang(currentLang) {
  return { type: "SET_CURRENT_LANG", currentLang }
}


// TOPICS ------------------------

export function selectTopic(selected) {
  return { type: "SELECT_TOPIC", selected };
}

export function unselectTopic(selected) {
  return { type: "UNSELECT_TOPIC", selected };
}

export function addTopic(topic) {
  return { type: "ADD_TOPIC", topic }
}

export function deleteTopic(topic) {
  return { type: "DELETE_TOPIC", topic }
}

export function setTopics(topics) {
  return { type: "SET_TOPICS", topics }
}

export function fetchTopics() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`topics`)
      .once('value')
      .then(snap => {
        dispatch(setTopics(snap.val()));
      })
      .catch(error => {
        console.log("Error fetching topics", error)
      })
  };
}

export function pushTopic(topic) {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`topics/${topic.id}`).update(topic, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      }

      dispatch(addTopic(topic));
      dispatch(
        showNotification(
          "Your changes have been saved.",
          "success"
        )
      );
    })
  };
}

export function removeTopic(topicId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();

    db.ref(`topics/`).update({[topicId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      let allTopics = { ...state.topics.topics };
      delete allTopics[topicId]

      dispatch(setTopics(allTopics));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}


// CATEGORIES ------------------------

export function selectCategory(selected) {
  return { type: "SELECT_CATEGORY", selected };
}

export function unselectCategory(selected) {
  return { type: "UNSELECT_CATEGORY", selected };
}

export function addCategory(category) {
  return { type: "ADD_CATEGORY", category }
}

export function setCategories(categories) {
  return { type: "SET_CATEGORIES", categories }
}

export function updateTranslationState(translation) {
  return { type: "UPDATE_TRANSLATION_STATE", translation}
}


export function fetchTranslations() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`translations`)
      .once('value')
      .then(snap => {
        dispatch(setTranslations(snap.val()));
      })
      .catch(error => {
        console.log("Error fetching translations", error)
      })
  };
}

export function updateTranslation(translation) {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`translations/${translation.id}`).update(translation, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      }

      dispatch(updateTranslationState(translation));
      dispatch(
        showNotification(
          "Your changes have been saved.",
          "success"
        )
      );
    })
  };
}

export function removeCategory(categoryId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();

    db.ref(`categories/`).update({[categoryId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      let allCategories = { ...state.categories.categories };
      delete allCategories[categoryId]

      dispatch(setCategories(allCategories));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}

export function setTranslations(strings) {
  return { type: "SET_TRANSLATIONS", strings }
}

export function setTags(strings) {
  return { type: "SET_TAGS", strings }
}

export function setSelectedTag(selection) {
  return { type: 'SET_SELECTED_TAG', selection}
}

export function saveSelectedTag(selection) {
  return (dispatch, getState) => {
    if (localStorage !== undefined && localStorage !== null) {
      if (selection) {
        localStorage.setItem('money-guide-province-id', selection.id)
      } else {
        localStorage.removeItem('money-guide-province-id')
      }
    }
    dispatch(setSelectedTag(selection))
  }
}

export function openTagSelectorModal() {
  return { type: 'OPEN_TAG_SELECTOR_MODAL' }
}

export function closeTagSelectorModal() {
  return { type: 'CLOSE_TAG_SELECTOR_MODAL' }
}


// ADMIN -----------------------------------

export function fetchUsers() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`users`)
      .once('value')
      .then(snap => {
        const users = Object.values(snap.val())
        console.log("Fetched users", users)
        dispatch(setUsers(users));
      })
      .catch(error => {
        console.log("Error fetching users", error)
      })
  };
}

export function setUsers(users) {
  return { type: "SET_USERS", users }
}

export function fetchAccessCode() {
  return (dispatch, getState) => {

    console.log("fetching access code")
    const db = firebase.database();

    db.ref(`access_code`)
      .once('value')
      .then(snap => {
        const accessCode = snap.val()
        console.log("accessCode", accessCode)
        dispatch(setAccessCode(accessCode));
      })
      .catch(error => {
        console.log("Error fetching access code", error)
      })
  };
}

export function setAccessCode(accessCode) {
  return { type: 'SET_ACCESS_CODE', accessCode }
}
