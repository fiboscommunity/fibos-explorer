import React, { Component } from "react";
import intl from "react-intl-universal";

import withStorage from "../../components/WrappedComponent/index";

import { loginIronman } from "../../model/ironman";
import { newaccount, getAccount, getPermissions } from "./action";

import { Form, Input, Button, Checkbox } from "antd";

import stroage from "../../model/stroage";

class creatAcountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      loading: false,
      transfer: false,
      coinType: "",
      precision: 4,
      disabledSwitch: false
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
            values.transfer = this.state.transfer;
            newaccount(fo, values, data => {
              if (data.transaction_id) {
                this.setState({
                  result: data.transaction_id,
                  loading: true
                });
              }
            });
          },
          () => {},
          config
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { coinType, disabledSwitch } = this.state;
    return (
      <div className="tools">
        <div className="content">
          <h4>{intl.get("createaccounttip", { plugin: "FO Wallet" })}</h4>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label={intl.get("creator")}>
              {getFieldDecorator("creator", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseinputcreateaccount")
                  }
                ],
                initialValue: this.props.accountName
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label={intl.get("newaccount")}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseinputnewaccount")
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        let re = /^[a-z1-5]{12}$/;
                        if (!re.test(value)) {
                          callback("账户名需要12个字符，字符包括a-z和1-5");
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder={intl.get("accountinput")}
                  disabled={disabledSwitch}
                />
              )}
            </Form.Item>

            <Form.Item label={"Owner " + intl.get("pubkey")}>
              {getFieldDecorator("owner", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseownerpubkey")
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        if (value.indexOf(coinType) !== 0) {
                          callback(intl.get("stringbegin") + " " + coinType);
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder={intl.get("stringbegin") + "'" + coinType + "'"}
                  disabled={disabledSwitch}
                />
              )}
            </Form.Item>

            <Form.Item label={"Active " + intl.get("pubkey")}>
              {getFieldDecorator("active", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseactivepubkey")
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        if (value.indexOf(coinType) !== 0) {
                          callback(intl.get("stringbegin") + " " + coinType);
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder={intl.get("stringbegin") + "'" + coinType + "'"}
                  disabled={disabledSwitch}
                />
              )}
            </Form.Item>

            <Form.Item
              label={intl.get("netmortgage") + " (" + this.state.coinType + ")"}
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

            <Form.Item
              label={intl.get("cpumortgage") + " (" + this.state.coinType + ")"}
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

            <Form.Item label={intl.get("ram") + " (bytes)"}>
              {getFieldDecorator("bytes", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleasebuyram")
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

            <Form.Item>
              {getFieldDecorator("transfer")(
                <Checkbox
                  onChange={this.handleChange}
                  disabled={disabledSwitch}
                >
                  {intl.get("createaccounttip2")}
                </Checkbox>
              )}
              <p>{intl.get("createaccounttip3")}</p>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabledSwitch}
              >
                {intl.get("createaccount")}
              </Button>
            </Form.Item>
          </Form>

          {this.state.loading ? (
            <div>
              <h4>{intl.get("tranresult")}</h4>
              <p className="transactionID">
                {intl.get("transaction")}ID：<span>{this.state.result}</span>
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

const index = Form.create({ name: "creatAcount" })(creatAcountForm);

export default withStorage(index);
