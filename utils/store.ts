
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

function removeUser() {
  localStorage.removeItem('user')
}


function retrieveUser() {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user)
    } else {
      return null
    }
}


function savePrompts(prompts) {
  localStorage.setItem('prompts', JSON.stringify(prompts))
}

function retrievePrompts() {
  const prompts = localStorage.getItem('prompts')
  if (prompts) {
    return JSON.parse(prompts)
  } else {
    return null
  }
}

export {saveUser,retrieveUser,savePrompts,retrievePrompts,removeUser}