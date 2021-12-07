import React, { Component } from 'react';

import { Form } from 'antd';
import autoBind from 'react-autobind';
import InputNumberFuc from './InputNumber';

@Form.create()
class RangeNumber extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }

  syncSave = () => {
    const { form, onBlur } = this.props;
    console.log(form.getFieldsValue());
    if (onBlur) {
      onBlur({ start: form.getFieldValue('startValue'), end: form.getFieldValue('endValue') });
    }
  };

  render() {
    const {
      form,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Form>
          <Form.Item>
            {getFieldDecorator('startValue', {
              rules: [],
              initialValue: 1,
            })(
              <InputNumberFuc
                style={{ width: 48 }}
                onBlur={this.syncSave}
                getScrollContainer={() => document.getElementById('rightForm')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('endValue', {
              rules: [],
              initialValue: 1,
            })(
              <InputNumberFuc
                style={{ width: 48 }}
                onBlur={this.syncSave}
                min={form.getFieldValue('startValue')}
                getScrollContainer={() => document.getElementById('rightForm')}
              />,
            )}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default RangeNumber;
