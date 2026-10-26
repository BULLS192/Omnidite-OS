// Portable template ONLY. Does not modify the existing BULLS192/TTT-OS app.
export const tttExampleProfile=Object.freeze({
  id:'ttt',name:'TTT-OS',subtitle:'Transportation operations',
  organization:'Thompson Transportation Technologies',currency:'USD',
  primary:'#183e5f',accent:'#e3a54d',
  modules:['crm','delivery','finance','settings'],
  extensions:[{
    id:'vehicles',module:'delivery',label:'Vehicle register',
    fields:[
      {key:'name',label:'Vehicle',kind:'text',required:true},
      {key:'plate',label:'Plate',kind:'text'},
      {key:'status',label:'Vehicle status',kind:'select',options:['Available','Scheduled','In Service','Inactive']},
      {key:'notes',label:'Notes',kind:'text'}
    ],
    listColumns:['name','plate','status']
  }],
  initialWorkspaces:[{id:'ttt',name:'Thompson Transportation Technologies'}]
});
