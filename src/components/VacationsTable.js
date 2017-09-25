import React from 'react';
import Vacation from './Vacation';

import { Table } from 'react-bootstrap';

class VacationsTable extends React.Component {
  constructor(props) {
    super(props);

    this.deleteVac = this.deleteVac.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.editVac = this.editVac.bind(this);
  }

  deleteVac(id) {
    this.props.delete(id);
  }

  handleFilterChange(e) {
    this.props.onFilterChange(e.target.text);
  }

  editVac(item) {
    if (this.props.edit(item)) {
      return true;
    } 
    return false;
  }

  render() {
    let tableItems = this.props.vacations.map(item => (
      <Vacation key={item.id} 
                {...item} 
                onDelete={ this.deleteVac }
                onEdit={ this.editVac }/>
    )); 
    let direction;
    switch(this.props.direction) {
      case '': 
        direction = (<span className="glyphicon glyphicon-chevron-up"></span>);
        break;          
      case 'reverse':
        direction = (<span className="glyphicon glyphicon-chevron-down"></span>);
        break;
      default:
        direction = '';
        break;
    }

    return (      
      <Table bordered condensed>
        <thead>
          <tr>
            <th>
              <a href="#" onClick={ this.handleFilterChange }>
                Фамилия        
                { this.props.filter == 'last_name' ? direction : ''}
              </a>            
            </th>
            <th>Имя</th>
            <th>Должность</th>
            <th>
              <a href="#" onClick={ this.handleFilterChange }>
                Начало
                { this.props.filter == 'start_date' ? direction : ''}
              </a>
            </th>
            <th>Окончание</th>
          </tr>
        </thead>
        <tbody>
          { tableItems }
        </tbody>
      </Table>
      
    )
  }
}

export default VacationsTable;