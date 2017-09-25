import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import './App.css';

import AddVacationForm from './components/AddVacationForm';
import VacationsTable from './components/VacationsTable';

class App extends Component {
  constructor() {
    super();

    this.state = {
      vacations: [],
      filter: 'default',
      filterDirection: ''
    }    

    this.addVacation = this.addVacation.bind(this);
    this.deleteVacation = this.deleteVacation.bind(this);
    this.editVacation = this.editVacation.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.getVacationsFromStorage = this.getVacationsFromStorage.bind(this);
  }

  componentDidMount() {
    this.setState({
      vacations: this.getVacationsFromStorage()
    })
  }

  getVacationsFromStorage() {
    let vacations = [];
    if (localStorage.length && localStorage.getItem('vacations')) {
      let vacs = localStorage.getItem('vacations');
      vacations = JSON.parse(vacs).map((item) => {
                        return item;
                      });
    } else {
      vacations = [];
    } 
    return vacations;
  }

  toLocalStorage() {
    localStorage.setItem('vacations', JSON.stringify(this.state.vacations));
  }

  validateDates(vacation) {
    let start = new Date(vacation.start);
    let end = new Date(vacation.end);
    let vacations = this.state.vacations;
    let vacs = getVacationsForEmployee(vacation);
    let lastVacation = vacs.length !== 0 ? new Date(vacs[vacs.length-1].end) : false;

    function getDaysCount(ms) {
      return (ms / 86400000);
    }

    function getVacationsForEmployee(vacation) {
      let lname = vacation.lastName;
      let fname = vacation.firstName;
      let now = new Date();
      return vacations.filter(item => {
        var start = new Date(item.start);
        return item.lastName === lname && 
               item.firstName === fname &&
               start.getFullYear() === now.getFullYear() &&
               item.id !== vacation.id;
      });
    }

    function getCompletedDays(vacation) {      
      let vacs = getVacationsForEmployee(vacation);

      let completed = 0;
      for (var i = 0; i < vacs.length; i++) {
        completed += getDaysCount(new Date(vacs[i].end) - new Date(vacs[i].start));
      }
      return completed;
    }

    function minPeriod(vacation) {
      let vacs = getVacationsForEmployee(vacation);
      let period = vacs.length !== 0 ? getDaysCount(new Date(vacs[0].end) - new Date(vacs[0].start)) : 0;
      return period;
    }

    if (start > end) {
      return {
        validated: false,
        msg: 'Отпуск не может закончиться раньше начала' 
      }
    } else if (getDaysCount(end - start) < 2) {
      return {
        validated: false,
        msg: 'Минимальный непрерывный период отпуска - 2 календарных дня' 
      }
    } else if (getDaysCount(end - start) > 15) {
      return {
        validated: false,
        msg: 'Максимальный непрерывный период отпуска - 15 календарных дней' 
      }
    } else if (lastVacation && (lastVacation.setDate(lastVacation.getDate() + minPeriod(vacation))) > start) {
      return {
        validated: false,
        msg: 'Минимальный период между периодами отпуска не истёк'
      }
    } else if (getCompletedDays(vacation) + getDaysCount(end - start) > 24) {
      return {
        validated: false,
        msg: 'У этого сотрудника осталось ' + (24 - getCompletedDays(vacation))  + 'дней отпуска' 
      }
    }
    return {
      validated: true,
      msg: 'valid'
    };
  }

  addVacation(item) {
    let nextId = this.state.vacations.length !== 0 ? Math.max.apply(null, this.state.vacations.map(vac => vac.id)) : 0;
    item.id = nextId + 1;
    let response = this.validateDates(item);
    if ( response.validated ){
      this.setState({
        vacations: this.state.vacations.concat(item)
      }, this.toLocalStorage );
      return { 
        valid: true 
      };
    } 
    return  { 
      valid: false,
      msg: response.msg
    };
  }

  changeFilter(filter) {
    switch(filter) {
      case 'Фамилия': 
        if (this.state.filter === 'last_name' && this.state.filterDirection === '') 
          this.setState({ filterDirection: 'reverse' }); 
        else if (this.state.filter === 'last_name' && this.state.filterDirection === 'reverse') 
          this.setState({ filterDirection: '' })
        else 
          this.setState({ filter: 'last_name', filterDirection: '' });
        break;
      case 'Начало':
        if (this.state.filter === 'start_date' && this.state.filterDirection === '') 
          this.setState({ filterDirection: 'reverse' }); 
        else if (this.state.filter === 'start_date' && this.state.filterDirection === 'reverse') 
          this.setState({ filterDirection: '' })
        else 
          this.setState({ filter: 'start_date', filterDirection: '' });
        break;
      default:
        this.setState({ filter: 'dafault'});
        break;
    }
  }

  deleteVacation(id) {
    this.setState({
      vacations: this.state.vacations.filter(item => item.id !== id)
    }, this.toLocalStorage );
  }

  editVacation(editedItem) {
    let item = this.state.vacations.find((item) => item.id === editedItem.id);
    let newItem = {...item};
    let itemIndex = this.state.vacations.indexOf(item);

    newItem.start = editedItem.newStart;
    newItem.end = editedItem.newEnd;

    let response = this.validateDates(newItem);
    if ( response.validated ){
      this.state.vacations.splice(itemIndex, 1, newItem);
      this.setState({
        vacations: this.state.vacations
      }, this.toLocalStorage);
      return true;
    } 
    return  false;
  }

  sortByLastName(data) {
    let output = [...data];
    return output.sort((item1 , item2) => {
      return item1.lastName.localeCompare(item2.lastName);
    });
  }

  sortByStartDate(data) {
    let output = [...data];
    return output.sort((item1 , item2) => {
      return (new Date(item1.start) - new Date(item2.start));
    });
  }

  defaultSort(data) {    
    let output = [...data];
    return output.sort((item1, item2) => {
      if(new Date(item1.start) - new Date(item2.start) === 0) {
        return item1.lastName.localeCompare(item2.lastName);
      }
      return new Date(item1.start) - new Date(item2.start);
    });
  }

  render() {
    let vacations = [];
    switch(this.state.filter) {
      case 'last_name':
        if (this.state.filterDirection === '') 
          vacations = this.sortByLastName(this.state.vacations);
        else 
          vacations = this.sortByLastName(this.state.vacations).reverse();
        break;
      case 'start_date':
        if (this.state.filterDirection === '')
          vacations = this.sortByStartDate(this.state.vacations);
        else 
          vacations = this.sortByStartDate(this.state.vacations).reverse();
        break;
      case 'default':
        vacations = this.defaultSort(this.state.vacations);
        break;
    }

    return (
      <Col mdOffset={3} md={6} xs={6} xsOffset={3}>
        <AddVacationForm onAdd={ this.addVacation } />
        <VacationsTable vacations={ vacations } 
                        delete={ this.deleteVacation }
                        edit={ this.editVacation }
                        onFilterChange={ this.changeFilter }
                        filter={ this.state.filter }
                        direction={ this.state.filterDirection }
                        />
      </Col>
    );
  }
}

export default App;
