const makeArrayOf = {
  folders(){
    return [
      {
        id: 1,
        title : "Important"
      },
      {
        id : 2,
        title : "Super"
      },
      {
        id : 3,
        title : "Secret"
      }
    ]
  },
  notes(){
    return [
      {
        id: 1,
        title: "One",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
        date_created: "2019-03-08T21:01:37.703Z",
        folder: 1
      },
      {
        id: 2,
        title: "TwoTwo",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
        date_created: "2019-03-08T21:01:37.703Z",
        folder: 2
      },
      {
        id: 3,
        title: "Three three three",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
        date_created: "2019-03-08T21:01:37.703Z",
        folder: 3
      },
    ]
  }
}

module.exports = {
  makeArrayOf
}