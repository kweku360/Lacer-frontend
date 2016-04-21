import DS from 'ember-data';

export default DS.Model.extend({
  suitnumber: DS.attr("string"),
  type: DS.attr("string"),
  datefiled: DS.attr("number"),
  title: DS.attr("string"),
  suitstatus: DS.attr("string"),
  suitaccess: DS.attr("string"),
  dateofadjournment: DS.attr("number")

})


  //.reopenClass({
  //  FIXTURES: [
  //    {
  //      id: 1,
  //      suitnumber: "A0/3445",
  //      type: "writ of summons",
  //      plaintifflawyerid: "90032",
  //      plaintifflawyername: "Akotto Samuel",
  //      defendantlawyerid: 0,
  //      defendantlawyername: "none",
  //      datefiled: "145599323",
  //      judgeid: 0,
  //      judgename: "none",
  //      suitstatus: "active",
  //      dateofadjournment: 0
  //    },
  //    {
  //      id: 2,
  //      suitnumber: "AA/4231",
  //      type: "writ of summons",
  //      plaintifflawyerid: "09921",
  //      plaintifflawyername: "Nkansah james",
  //      defendantlawyerid: 0,
  //      defendantlawyername: "none",
  //      datefiled: "134422344",
  //      judgeid: 0,
  //      judgename: "none",
  //      suitstatus: "active",
  //      dateofadjournment: 0
  //    },
  //    {
  //      id: 3,
  //      suitnumber: "AA/4231",
  //      type: "writ of summons",
  //      plaintifflawyerid: "09921",
  //      plaintifflawyername: "Nkansah james",
  //      defendantlawyerid: 0,
  //      defendantlawyername: "none",
  //      datefiled: "134422344",
  //      judgeid: 0,
  //      judgename: "none",
  //      suitstatus: "active",
  //      dateofadjournment: 0
  //    }
  //  ]
  //});
