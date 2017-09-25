import React from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import { Form, FormControl, FormGroup, ControlLabel, Col, Well, Button} from 'react-bootstrap';

class AddVacationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationMessage: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  resetForm() {    
    this.setState({
      validationMessage: ''
    });
    this.lName.value = '';
    this.fName.value = '';
    this.pos.value = '';
    this.startDate.value = new Date().toISOString();
    this.endDate.value = new Date().toISOString();
  }

  handleSubmit(e) {    
    e.preventDefault();    

    let resp = this.props.onAdd({
      lastName: this.lName.value,
      firstName: this.fName.value,
      position: this.pos.value,
      start: this.startDate.getValue().slice(0, 10),
      end: this.endDate.getValue().slice(0, 10)
    });

    if ( resp.valid ) {      
      this.resetForm();
    } else {
      console.log(resp.msg);
      this.setState({
        validationMessage: resp.msg
      })
    }
  }

  render() {   
    let start = new Date();
    let end = new Date();
    end.setDate(end.getDate() + 2);

    return (
      <Well>
        <Form horizontal onSubmit={ this.handleSubmit }>
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Фамилия
            </Col>
            <Col md={10}>
              <FormControl componentClass="input" inputRef={(input) => this.lName = input} placeholder="Фамилия" required />
            </Col>
          </FormGroup>
      
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Имя
            </Col>
            <Col md={10}>
              <FormControl type="input" inputRef={(input) => this.fName = input} placeholder="Имя" required />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Должность
            </Col>
            <Col md={10}>
              <FormControl type="input" inputRef={(input) => this.pos = input} placeholder="Должность" required />
            </Col>
          </FormGroup>
          
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>
              Начало
            </Col>
            <Col md={4}>
              <DatePicker id="vac-start" 
                ref={(input) => this.startDate = input} 
                value={ start.toISOString() }
                required
                />  
            </Col> 
            <Col componentClass={ControlLabel} md={2}>
              Окончание
            </Col>
            <Col md={4}>
              <DatePicker id="vac-end" 
                ref={(input) => this.endDate = input}  
                value={ end.toISOString() }
                required
                />  
            </Col>  
          </FormGroup>

          <FormGroup>
            <Col sm={4}>
              <Button type="submit">
                Отправить в отпуск
              </Button>
            </Col>
          </FormGroup>

          { this.state.validationMessage !== '' ? <FormGroup >
            <Col componentClass={ControlLabel}>
             { this.state.validationMessage }
            </Col>
          </FormGroup> : ''}
        </Form> 
      </Well>
    );
  }
}

export default AddVacationForm;