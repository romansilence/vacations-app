import React from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import { Modal, Form, FormGroup, Col, ControlLabel, Button} from 'react-bootstrap';

const EditModal = React.createClass({
  render() {    
    let start = new Date(this.props.start);
    let end = new Date(this.props.end);
    let self = this; 
    
    function handleSubmit(e) {
      e.preventDefault();

      if (self.props.onSave({
        id: self.props.id,
        newStart: self.startDate.getValue().slice(0, 10),
        newEnd: self.endDate.getValue().slice(0, 10)
      })) {
        self.props.onHide();
      } else return;      
    }

    return (
      <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">{ this.props.fullName }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={ handleSubmit }>
            <FormGroup>
              <Col componentClass={ControlLabel}>
                Начало
              </Col>
              <Col>
                <DatePicker id="vac-start" 
                  ref={(input) => this.startDate = input} 
                  value={ start.toISOString() }
                  required
                  />  
              </Col> 
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel}>
                Окончание
              </Col>
              <Col>
                <DatePicker id="vac-end" 
                  ref={(input) => this.endDate = input}  
                  value={ end.toISOString() }
                  required
                  />  
              </Col>  
            </FormGroup>
            <FormGroup>
              <Button type="submit" bsStyle="primary">Сохранить изменения</Button>
              <Button onClick={ this.props.onHide }>Закрыть</Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
});

class Vacation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }

    this.handleDelete = this.handleDelete.bind(this); 
    this.handleEdit = this.handleEdit.bind(this);
    this.onEditing = this.onEditing.bind(this);
  }

  handleDelete(e) {
    this.props.onDelete(this.props.id);
  }

  handleEdit() {
    this.setState({editing: true});
  }

  onEditing(newItem) {
    if (this.props.onEdit(newItem)) {
      return true;
    } 
    return false;
  }

  render() {    
    let closeModal = () => this.setState({ editing: false });

    let type = '';
    let today = new Date();
    let start = new Date(this.props.start);
    let end = new Date(this.props.end);
    if (start >= today) 
      type = 'upcoming';
    else if  (end <= today)
      type = 'completed';
    else 
      type = 'current';   
      
    return (      

      <tr className={ type }>
        <EditModal 
          show={ this.state.editing } 
          onHide={ closeModal }
          onSave={ this.onEditing }
          start={ start } 
          end={ end } 
          id={ this.props.id }
          fullName={ this.props.lastName + ' ' + this.props.firstName }
        />

        <td>{ this.props.lastName }</td>
        <td>{ this.props.firstName }</td>
        <td>{ this.props.position }</td>
        <td className="start-date">
          { this.props.start } 
        </td>
        <td className="end-date">
          { this.props.end }
          { type === 'upcoming' 
              ? (<span>
                  <span className="glyphicon glyphicon-pencil edit-span"
                    aria-hidden="true"
                    onClick={ this.handleEdit }>
                  </span> 
                  <span className="glyphicon glyphicon-trash delete-span"
                    aria-hidden="true"
                    onClick={ this.handleDelete }>
                  </span>                
                </span>)
              : '' 
          }
        </td>
      </tr>
    )
  }
}

export default Vacation;