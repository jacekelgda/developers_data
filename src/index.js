const Slack = require('slack-node')
const dotenv = require('dotenv').config()
const slack = new Slack(process.env.SLACK_API_KEY)

const getUsers = () => {
  return new Promise((resolve, reject) => {
    slack.api('users.list', (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.members)
      }
    })
  })
}

const filterActiveMembers = (members) => {
  let filtered = [];
  for ( let i=0;i < members.length; i += 1 ) {
    const user = members[i]
    if (!user.deleted && !user.is_restricted && !user.is_bot && !user.is_ultra_restricted) {
      filtered.push(user)
    }
  }

  return filtered
}

const getUserProfileInfo = (user) => {
  return new Promise((resolve, reject) => {
    slack.api('users.profile.get', { user }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.profile)
      }
    })
  })
}

const init = async () => {
  const members = await getUsers().then(filterActiveMembers)
  for (let i=0;i<members.length;i+=1) {
      const userDetails = await getUserProfileInfo(members[i].id)
      if (userDetails.fields && userDetails.fields.Xf0EEC1F63) {
          console.log(`${userDetails.real_name} @${userDetails.display_name} from: ${userDetails.fields.Xf0EEC1F63.value}`)
      } else {
          console.log(`${userDetails.real_name} @${userDetails.display_name} location not set`)
      }
  }
}

init()
