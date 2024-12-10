// ** Mock
import mock from 'src/@fake-db/mock'

const data = {
  users: [
    {
      id: 46,
      billing: 'Manual - Credit Card',
      fullName: 'Saunder Offner',
      company: 'Skalith PVT LTD',
      role: 'maintainer',
      username: 'soffner19',
      country: 'Poland',
      contact: '(200) 586-2264',
      email: 'soffner19@mac.com',
      currentPlan: 'enterprise',
      status: 'pending',
      avatar: '',
      avatarColor: 'primary'
    },
    {
      id: 47,
      billing: 'Auto Debit',
      fullName: 'Karena Courtliff',
      company: 'Feedfire PVT LTD',
      role: 'admin',
      username: 'kcourtliff1a',
      country: 'China',
      contact: '(478) 199-0020',
      email: 'kcourtliff1a@bbc.co.uk',
      currentPlan: 'basic',
      status: 'active',
      avatar: '/images/avatars/1.png'
    },
    {
      id: 48,
      billing: 'Auto Debit',
      fullName: 'Onfre Wind',
      company: 'Thoughtmix PVT LTD',
      role: 'admin',
      username: 'owind1b',
      country: 'Ukraine',
      contact: '(344) 262-7270',
      email: 'owind1b@yandex.ru',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'error'
    },
    {
      id: 49,
      billing: 'Auto Debit',
      fullName: 'Paulie Durber',
      company: 'Babbleblab PVT LTD',
      role: 'subscriber',
      username: 'pdurber1c',
      country: 'Sweden',
      contact: '(694) 676-1275',
      email: 'pdurber1c@gov.uk',
      currentPlan: 'team',
      status: 'inactive',
      avatar: '',
      avatarColor: 'warning'
    },
    {
      id: 50,
      billing: 'Manual - Cash',
      fullName: 'Beverlie Krabbe',
      company: 'Kaymbo PVT LTD',
      role: 'editor',
      username: 'bkrabbe1d',
      country: 'China',
      contact: '(397) 294-5153',
      email: 'bkrabbe1d@home.pl',
      currentPlan: 'company',
      status: 'active',
      avatar: '/images/avatars/2.png'
    }
  ]
}

const projectListData = [
  {
    id: 1,
    hours: '18:42',
    progressValue: 78,
    totalTask: '122/240',
    progressColor: 'success',
    projectType: 'React Project',
    projectTitle: 'BGC eCommerce App',
    img: '/images/icons/project-icons/react.png'
  },
  {
    id: 2,
    hours: '20:42',
    progressValue: 18,
    totalTask: '9/56',
    progressColor: 'error',
    projectType: 'Figma Project',
    projectTitle: 'Falcon Logo Design',
    img: '/images/icons/project-icons/figma.png'
  },
  {
    id: 3,
    hours: '120:87',
    progressValue: 62,
    totalTask: '290/320',
    progressColor: 'primary',
    projectType: 'VueJs Project',
    projectTitle: 'Dashboard Design',
    img: '/images/icons/project-icons/vue.png'
  },
  {
    id: 4,
    hours: '89:19',
    progressValue: 8,
    totalTask: '7/63',
    progressColor: 'error',
    projectType: 'Xamarin Project',
    projectTitle: 'Foodista Mobile App',
    img: '/images/icons/project-icons/xamarin.png'
  },
  {
    id: 5,
    hours: '230:10',
    progressValue: 49,
    totalTask: '120/186',
    progressColor: 'warning',
    projectType: 'Python Project',
    projectTitle: 'Dojo React Project',
    img: '/images/icons/project-icons/python.png'
  },
  {
    id: 6,
    hours: '342:41',
    progressValue: 92,
    totalTask: '99/109',
    progressColor: 'success',
    projectType: 'Sketch Project',
    projectTitle: 'Blockchain Website',
    img: '/images/icons/project-icons/sketch.png'
  },
  {
    id: 7,
    hours: '12:45',
    progressValue: 88,
    totalTask: '98/110',
    progressColor: 'success',
    projectType: 'HTML Project',
    projectTitle: 'Hoffman Website',
    img: '/images/icons/project-icons/html5.png'
  }
]

// POST: Add new user
mock.onPost('/apps/users/add-user').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data).data
  const lastId = Math.max(...data.users.map(u => u.id), 0)
  user.id = lastId + 1
  data.users.unshift({ ...user, avatar: '', avatarColor: 'primary', status: 'active' })

  return [201, { user }]
})

// GET: DATA
mock.onGet('/apps/users/list').reply(config => {
  const { q = '', role = null, status = null, currentPlan = null } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = data.users.filter(
    user =>
      (user.username.toLowerCase().includes(queryLowered) ||
        user.fullName.toLowerCase().includes(queryLowered) ||
        user.role.toLowerCase().includes(queryLowered) ||
        (user.email.toLowerCase().includes(queryLowered) &&
          user.currentPlan.toLowerCase().includes(queryLowered) &&
          user.status.toLowerCase().includes(queryLowered))) &&
      user.role === (role || user.role) &&
      user.currentPlan === (currentPlan || user.currentPlan) &&
      user.status === (status || user.status)
  )

  return [
    200,
    {
      allData: data.users,
      users: filteredData,
      params: config.params,
      total: filteredData.length
    }
  ]
})

// DELETE: Deletes User
mock.onDelete('/apps/users/delete').reply(config => {
  // Get user id from URL
  const userId = config.data
  const userIndex = data.users.findIndex(t => t.id === userId)
  data.users.splice(userIndex, 1)

  return [200]
})

// GET: DATA
mock.onGet('/apps/users/project-list').reply(config => {
  const { q = '' } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = projectListData.filter(
    user =>
      user.projectTitle.toLowerCase().includes(queryLowered) ||
      user.projectType.toLowerCase().includes(queryLowered) ||
      user.totalTask.toLowerCase().includes(queryLowered) ||
      user.hours.toLowerCase().includes(queryLowered) ||
      String(user.progressValue).toLowerCase().includes(queryLowered)
  )

  return [200, filteredData]
})
