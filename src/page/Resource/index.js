import React, { Component } from "react";
import intl from "react-intl-universal";

import { loginIronman } from "../../model/ironman";
import {
  delegatebw,
  undelegatebw,
  getAccount,
  getPermissions,
  buyram,
  sellram
} from "./action";
import withStorage from "../../components/WrappedComponent/index";

import stroage from "../../model/stroage";

import {
  Form,
  Input,
  Button,
  Radio,
  Popover,
  Checkbox,
  Select,
  Row,
  Col
} from "antd";

const Option = Select.Option;

class ResourceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "mortgage",
      transfer: false,
      result: "",
      loading: false,
      coinType: "",
      precision: 4,
      disabledSwitch: false,
      receiver: "",
      showMortgageCheckBox: false
    };
  }

  componentDidMount = () => {
    const account = stroage.get("account");
    if (account) {
      getAccount({ account_name: account }, data => {
        if (data && data.total_resources && data.total_resources.cpu_weight) {
          const coinType = data.total_resources.cpu_weight.split(" ")[1];
          this.setState({
            coinType
          });
          getPermissions(
            {
              code: "eosio.token",
              json: true,
              scope: account,
              table: "accounts"
            },
            rs => {
              rs.rows.map((item, index) => {
                if (
                  item.balance.contract === "eosio" &&
                  item.balance.quantity.split(" ")[1] === coinType
                ) {
                  this.setState({
                    precision: item.balance.quantity.split(" ")[0].split(".")[1]
                      .length
                  });
                }
                return false;
              });
            }
          );
        }
      });
    } else {
      this.setState({
        disabledSwitch: true
      });
    }
  };

  onChange = e => {
    this.props.form.resetFields();
    this.setState({
      value: e.target.value
    });
  };

  handleChange = e => {
    this.setState({
      transfer: e.target.checked
    });
  };

  handleSubmit = e => {
    const { config } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.coinType = this.state.coinType;
        values.precision = this.state.precision;
        loginIronman(
          (data, fo) => {
            if (this.state.value === "mortgage") {
              values.transfer = this.state.transfer;
              delegatebw(fo, values, data => {
                if (data.transaction_id) {
                  this.setState({
                    result: data.transaction_id,
                    loading: true
                  });
                }
              });
            }

            if (this.state.value === "remove") {
              undelegatebw(fo, values, data => {
                if (data.transaction_id) {
                  this.setState({
                    result: data.transaction_id,
                    loading: true
                  });
                }
              });
            }
            if (this.state.value === "buy") {
              buyram(fo, values, data => {
                if (data.transaction_id) {
                  this.setState({
                    result: data.transaction_id,
                    loading: true
                  });
                }
              });
            }

            if (this.state.value === "sell") {
              sellram(fo, values, data => {
                if (data.transaction_id) {
                  this.setState({
                    result: data.transaction_id,
                    loading: true
                  });
                }
              });
            }
          },
          () => {},
          config
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const content = (
      <div className="removeTip">
        <p className="removeTipTitle">{intl.get("note")}：</p>
        <p>{intl.get("redeemrestip")}</p>
      </div>
    );

    const { coinType, disabledSwitch, showMortgageCheckBox } = this.state;

    return (
      <div className="tools">
        <div className="content">
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator("radio-group", {
                initialValue: this.state.value
              })(
                <Radio.Group onChange={this.onChange}>
                  <Radio value="mortgage">{intl.get("mortgageres")}</Radio>

                  <Popover placement="bottom" content={content} trigger="click">
                    <Radio value="remove">{intl.get("redeemres")}</Radio>
                  </Popover>
                  <Radio value="buy">{intl.get("purchaseram")}</Radio>

                  <Radio value="sell">{intl.get("saleofram")}</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            {this.state.value === "mortgage" ||
            this.state.value === "remove" ? (
              <div>
                <Form.Item label={intl.get("mortgagor")}>
                  {getFieldDecorator("from", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleasemortgagor")
                      }
                    ],
                    initialValue: this.props.accountName
                  })(<Input disabled />)}
                </Form.Item>

                <Form.Item label={intl.get("collateraltaker")}>
                  {getFieldDecorator("receiver", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleasecollateraltaker")
                      }
                    ],
                    value: this.state.receiver
                  })(
                    <Input
                      disabled={disabledSwitch}
                      onChange={e => {
                        if (e.currentTarget.value === stroage.get("account")) {
                          this.setState({
                            receiver: e.currentTarget.value,
                            showMortgageCheckBox: true
                          });
                        } else {
                          this.setState({
                            receiver: e.currentTarget.value,
                            showMortgageCheckBox: false
                          });
                        }
                      }}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  label={intl.get("cpumortgage") + "（" + coinType + "）"}
                >
                  {getFieldDecorator("stake_cpu_quantity", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleasecpumortgage")
                      },
                      {
                        validator(rule, value, callback) {
                          if (value) {
                            if (isNaN(Number(value))) {
                              callback("请输入数字");
                              return;
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(<Input disabled={disabledSwitch} />)}
                </Form.Item>

                <Form.Item
                  label={intl.get("netmortgage") + "（" + coinType + "）"}
                >
                  {getFieldDecorator("stake_net_quantity", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleasenetmortgage")
                      },
                      {
                        validator(rule, value, callback) {
                          if (value) {
                            if (isNaN(Number(value))) {
                              callback("请输入数字");
                              return;
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(<Input disabled={disabledSwitch} />)}
                </Form.Item>
                {this.state.value === "mortgage" ? (
                  <Form.Item>
                    {getFieldDecorator("transfer")(
                      <Checkbox
                        onChange={this.handleChange}
                        disabled={disabledSwitch ? true : showMortgageCheckBox}
                      >
                        {intl.get("mortgagetip")}
                      </Checkbox>
                    )}
                  </Form.Item>
                ) : (
                  ""
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disabledSwitch}
                  >
                    {this.state.value === "mortgage"
                      ? intl.get("mortgage")
                      : intl.get("cancelmortgage")}
                  </Button>
                </Form.Item>
              </div>
            ) : (
              <div>
                <Form.Item
                  label={
                    this.state.value === "buy"
                      ? intl.get("purchaser")
                      : intl.get("seller")
                  }
                >
                  {getFieldDecorator(
                    this.state.value === "buy" ? "payer" : "account",
                    {
                      rules: [
                        {
                          required: true,
                          message: intl.get("pleasepurchaser")
                        }
                      ],
                      initialValue: this.props.accountName
                    }
                  )(<Input disabled />)}
                </Form.Item>

                {this.state.value === "buy" ? (
                  <Form.Item label={intl.get("receiver")}>
                    {getFieldDecorator("receiver", {
                      rules: [
                        {
                          required: true,
                          message: intl.get("pleasereceiver")
                        }
                      ]
                    })(<Input disabled={disabledSwitch} />)}
                  </Form.Item>
                ) : (
                  ""
                )}

                <Row gutter={8}>
                  <Col span={16}>
                    <Form.Item label={intl.get("amount2")}>
                      {getFieldDecorator(
                        this.state.value === "buy" ? "quant" : "bytes",
                        {
                          rules: [
                            {
                              required: true,
                              message: intl.get("pleaseamount2")
                            },
                            {
                              validator(rule, value, callback) {
                                if (value) {
                                  if (isNaN(Number(value))) {
                                    callback("请输入数字");
                                    return;
                                  }
                                }
                                callback();
                              }
                            }
                          ]
                        }
                      )(<Input disabled={disabledSwitch} />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label={intl.get("unit")}>
                      {getFieldDecorator("tokens", {
                        initialValue:
                          this.state.value === "sell"
                            ? "bytes"
                            : this.state.coinType
                      })(
                        <Select
                          showSearch
                          disabled={disabledSwitch}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.value === "sell" ? (
                            ""
                          ) : (
                            <Option value={coinType}>{coinType}</Option>
                          )}
                          <Option value="bytes">bytes</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disabledSwitch}
                  >
                    {this.state.value === "buy"
                      ? intl.get("purchase")
                      : intl.get("sell")}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form>

          {this.state.loading ? (
            <div>
              <h4>交易结果</h4>
              <p className="transactionID">
                交易ID：<span>{this.state.result}</span>
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const index = Form.create({ name: "resource" })(ResourceForm);

export default withStorage(index);
