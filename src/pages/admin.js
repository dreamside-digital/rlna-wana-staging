import React from 'react'
import { connect } from "react-redux";
import { filter, find } from 'lodash'
import Container from "@material-ui/core/Container"
import IconButton from "@material-ui/core/IconButton"
import DeleteForever from "@material-ui/icons/DeleteForever"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BrowserNotifications from '../components/notifications/BrowserNotifications'
import { push, Link } from 'gatsby'

import Layout from '../layouts/default';
import ProtectedPage from "../layouts/protected-page"

import { PERMANENT_PAGES } from "../utils/constants"

import {
  fetchPages,
  fetchUsers,
  fetchAccessCode,
  updateFirebaseData,
  deploy,
  userLoggedOut,
  showNotification,
  deleteAccount,
} from "../redux/actions";


const mapDispatchToProps = dispatch => {
  return {
    updateFirebaseData: (data, callback, msg) => {
      dispatch(updateFirebaseData(data, callback, msg))
    },
    fetchPages: () => {
      dispatch(fetchPages())
    },
    fetchUsers: () => {
      dispatch(fetchUsers())
    },
    fetchAccessCode: () => {
      dispatch(fetchAccessCode())
    },
    deploy: () => {
      dispatch(deploy())
    },
    userLoggedOut: () => {
      dispatch(userLoggedOut());
    },
    showNotification: () => {
      dispatch(showNotification());
    },
    deleteAccount: () => {
      dispatch(deleteAccount());
    },
  };
};

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    user: state.adminTools.user,
    pages: state.pages.pages,
    users: state.adminTools.users,
    accessCode: state.adminTools.accessCode,
    browserNotifications: state.adminTools.browserNotifications,
  };
};

class AdminPage extends React.Component {
  state = { accessCode: '' }

  componentDidMount() {
    this.props.fetchPages()
    this.props.fetchAccessCode()
    if (this.props.user?.isAdmin) {
      this.props.fetchUsers()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user?.isAdmin) {
        this.props.fetchUsers()
      }
    }

    if (prevProps.accessCode !== this.props.accessCode) {
      this.setState({ accessCode: this.props.accessCode })
    }
  }

  filterPagesByLanguage = (pages, lang) => {
    return filter(pages, page => (page.category === "modules" && (page.lang === lang.value)));
  }

  nextPage = page => {
    return this.props.pages[page.next];
  }

  prevPage = page => {
    return find(this.props.pages, p => p.next === page.id)
  }

  orderedPages = (page, arr=[]) => {
    if (!page) {
      return arr
    }

    if (arr.includes(page)) {
      return arr
    }

    arr.push(page)

    const nextPage = this.nextPage(page)
    if (page === nextPage) {
      return arr
    }
    return this.orderedPages(this.nextPage(page), arr)
  }

  movePageForward = currentPage => () => {
    if (!currentPage.next) return false;

    const nextPage = this.nextPage(currentPage)
    const prevPage = this.prevPage(currentPage)

    let dataToUpdate = {
      [`pages/${currentPage.id}/next`]: nextPage.next || null,
      [`pages/${nextPage.id}/next`]: currentPage.id,
    }

    if (currentPage.head) {
      dataToUpdate[`pages/${nextPage.id}/head`] = true
      dataToUpdate[`pages/${currentPage.id}/head`] = null
    }

    if (prevPage) {
      dataToUpdate[`pages/${prevPage.id}/next`] = nextPage.id
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchPages)
  }

  movePageBack = currentPage => () => {
    const prevPage = this.prevPage(currentPage)
    if (!prevPage) return false

    const prevPrevPage = this.prevPage(prevPage)

    let dataToUpdate = {
      [`pages/${currentPage.id}/next`]: prevPage.id,
      [`pages/${prevPage.id}/next`]: currentPage.next || null,
    }

    if (prevPage.head) {
      dataToUpdate[`pages/${currentPage.id}/head`] = true
      dataToUpdate[`pages/${prevPage.id}/head`] = null
    }

    if (prevPrevPage) {
      dataToUpdate[`pages/${prevPrevPage.id}/next`] = currentPage.id
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchPages)
  }

  deletePage = page => () => {
    if (typeof window !== 'undefined')  {
      if (!window.confirm("Are you sure you want to delete this page?")) {
        return false
      }

      const prevPage = this.prevPage(page)
      const nextPage = this.nextPage(page)

      let dataToUpdate = {
        [`pages/${page.id}`]: null,
      }

      if (prevPage) {
        dataToUpdate[`pages/${prevPage.id}/next`] = page.next || null
      }

      if (page.head && nextPage) {
        dataToUpdate[`pages/${nextPage.id}/head`] = true
      }

      if (page.translations) {
        Object.keys(page.translations).forEach(lang => {
          if (page.translations[lang]) {
            const translatedPageId = page.translations[lang].id
            dataToUpdate[`pages/${translatedPageId}/translations/${page.lang}`] = null
          }
        })
      }
      this.props.updateFirebaseData(dataToUpdate, this.props.fetchPages)
    }
  }

  onSaveTranslationChanges = (translation, translationId, lang) => newContent => {
    const newTranslation = { ...translation, [lang]: newContent.text, id: translationId }
    this.props.updateTranslation(newTranslation)
  }

  updateAccessCode = (e) => {
    e.preventDefault()
    const { accessCode } = this.state;
    this.props.updateFirebaseData({ access_code: accessCode })
    this.setState({ accessCode: '' })
  }

  logout = e => {
    this.props.userLoggedOut();
    push("/");
  };

  assignEditor = (user) => {
    this.props.updateFirebaseData({ [`users/${user.uid}/isEditor`]: true }, this.props.fetchUsers, `${user.displayName} is now an Editor on this website.`)
  }

  removeEditor = (user) => {
    this.props.updateFirebaseData({ [`users/${user.uid}/isEditor`]: false }, this.props.fetchUsers, `${user.displayName} is no longer an Editor on this website.`)
  }

  render() {
    const unorderedPages = filter(this.props.pages, page => !page.category || page.category === "uncategorized")

    return(
      <Layout theme="gray" className="admin-page">
        <ProtectedPage>
          <Container>
            <h1 className="">
              Website Configuration
            </h1>
          </Container>

          <Container>
            <h2>Access Code</h2>
            <div className="my-40">
              <form onSubmit={this.updateAccessCode} autoComplete="off" className="login-form mt-10 mb-6 display-flex flex-wrap">
                <input type="text" id="access-code" onChange={e => this.setState({ accessCode: e.currentTarget.value })} value={this.state.accessCode} />
                <input type="submit" value="Update access code" className="btn ml-2" />
              </form>
            </div>
          </Container>

          <Container>
            <BrowserNotifications />
          </Container>

          <Container>
            <h2>Pages</h2>
            <div className="my-40">
              {
                unorderedPages.map(page => {
                  return(
                    <div className="ranked-item" key={page.id}>
                      <IconButton size="small" color="primary" onClick={this.deletePage(page)} disabled={PERMANENT_PAGES.includes(page.id)}><DeleteForever /></IconButton>
                      <span className="ml-3"><Link to={page.slug} className="pretty-link">{page.title}</Link></span>
                    </div>
                  )
                })
              }
            </div>
          </Container>

          <Container>
            <div className="mt-10 mb-10">
              <button onClick={this.props.deploy} className="btn">Publish changes</button>
            </div>
          </Container>

          <Container>
            <h1 className="">
              Account Management
            </h1>
            <div className="mt-10 mb-10">
              <button onClick={this.props.deleteAccount} className="btn btn-dark">Delete my account</button>
            </div>
            {
              this.props.user?.isAdmin &&
              <div className="mb-10">
                <h2>User accounts</h2>
                <div className="my-40">
                  {
                    this.props.users.filter(u => u.uid !== this.props.user?.uid).map(user => {
                      return(
                        <Accordion key={user.uid}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${user.uid}-content`}
                            id={`${user.uid}-header`}
                          >
                            <div className="text-bold">{user.displayName}</div>
                          </AccordionSummary>
                          <AccordionDetails>
                            {
                              user.isAdmin ?
                              <div>
                                <p className="mt-0">{`Email: ${user.email}`}</p>
                                <p>This user is an Admin so you cannot edit their account. Contact your website administrator for assistance.</p>
                              </div>:
                              <div className="account-actions">
                                <p className="mt-0">{`Email: ${user.email}`}</p>
                                {
                                  user.isEditor ?
                                  <button className="btn btn-sm mr-1" onClick={() => this.removeEditor(user)}>Remove Editor</button> :
                                  <button className="btn btn-sm mr-1" onClick={() => this.assignEditor(user)}>Assign Editor</button>
                                }
                              </div>
                            }
                          </AccordionDetails>
                        </Accordion>
                      )
                    })
                  }
                </div>
              </div>
            }
          </Container>
        </ProtectedPage>
      </Layout>
    )
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
