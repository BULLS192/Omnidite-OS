export const omniditeProfile=Object.freeze({
  id:'omnidite',name:'Omnidite OS',subtitle:'Business command center',
  organization:'Omnidite Advisory',currency:'USD',primary:'#244c98',accent:'#8bc5ed',
  modules:['crm','delivery','finance','settings'],
  extensions:[{
    id:'assets',module:'delivery',label:'Asset register',
    fields:[
      {key:'name',label:'Asset',kind:'text',required:true},
      {key:'category',label:'Category',kind:'text'},
      {key:'status',label:'Lifecycle',kind:'select',options:['Active','Maintenance','Retired']},
      {key:'notes',label:'Notes',kind:'text'}
    ],
    listColumns:['name','category','status']
  }],
  initialWorkspaces:[
    {id:'omnidite-advisory',name:'Omnidite Advisory'},
    {id:'aedificatus',name:'Aedificatus'},
    {id:'space-city-darts',name:'Space City Darts'}
  ]
});
