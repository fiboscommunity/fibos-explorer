import React, { Component } from "react";

import {
  Layout,
  Col,
  Input,
  Form,
  Button,
  message,
  Icon,
  Modal,
  Select
} from "antd";
import Fibos from "fibos.js";

import * as actions from "./action";
import stroage from "../../model/stroage";
import { loginIronman, logoutIronman } from "../../model/ironman";
import intl from "react-intl-universal";

import { withRouter } from "react-router-dom";
import "./index.less";

const { Header } = Layout;
const Search = Input.Search;
const { Option } = Select;

class FormHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "home",
      account: {},
      acount_name: "",
      show: true,
      coinType: "",
      visible: false,
      language: localStorage.getItem("language")
        ? localStorage.getItem("language")
        : "zh"
    };
    if (this.state.language === "zh") {
      this.props.loadLocales("zh-CN");
    } else {
      this.props.loadLocales("en-US");
    }
  }

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  /* 登录Lronman */
  handLronman = () => {
    let pathName = window.location.pathname.split("/");
    pathName = pathName[1];
    if (pathName === "details") {
      pathName = "transfer";
    }
    const { config } = this.props;
    loginIronman(
      data => {
        let name = data.identity.accounts[0].name;
        stroage.set("account", name);
        this.setState({
          show: false,
          account_name: name
        });
        window.location.reload();
      },
      () => {
        this.showModal();
      },
      config
    );
  };

  removeLronman = () => {
    logoutIronman(() => {
      this.setState({
        show: true,
        account_name: ""
      });
      stroage.remove("account");
    });
  };

  onSearch = value => {
    if (value) {
      if (value.length === 64) {
        this.setState({
          current: "transaction"
        });
        this.props.history.push({
          pathname: "/transaction/" + value
        });
      } else if (
        Fibos.modules.ecc.isValidPublic(
          value,
          this.state.coinType ? this.state.coinType : ""
        )
      ) {
        this.setState({
          current: "publickey"
        });
        this.props.history.push({
          pathname: "/publickey/" + value
        });
      } else {
        let values = {
          account_name: value
        };
        actions.getAccount(
          values,
          getAccount => {
            this.setState({
              current: "details",
              account: getAccount
            });
            this.props.history.push({
              pathname: "/details/" + this.state.account.account_name
            });
          },
          () => {
            if (/^[0-9]*$/.test(value)) {
              this.setState({
                current: "block"
              });
              this.props.history.push({
                pathname: "/block/" + value
              });
            } else {
              message.error(intl.get("noaccount"));
            }
          }
        );
      }
    } else {
      message.info(intl.get("pleaseinputsearch"));
    }
  };

  componentDidMount() {
    let account_name = stroage.get("account");
    if (account_name) {
      this.setState({
        show: false,
        account_name: account_name
      });
    }

    actions.getCoin(
      {
        code: "eosio",
        json: true,
        scope: "eosio",
        table: "rammarket"
      },
      data => {
        if (data && data.rows && data.rows.length > 0) {
          this.setState({
            coinType: data.rows[0].quote.balance.split(" ")[1]
          });
        }
      }
    );
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    window.open("https://wallet.fo/zh-cn/fowallet");
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  handleChange = value => {
    if (value === "zh") {
      this.props.loadLocales("zh-CN");
    } else {
      this.props.loadLocales("en-US");
    }
    this.setState({
      language: value
    });
    localStorage.setItem("language", value);
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout className="header">
        <Header>
          <Col span={14}>
            <div>
              <Form>
                {getFieldDecorator("account_name")(
                  <Search
                    placeholder={
                      intl.get("account") +
                      "/" +
                      intl.get("pubkey") +
                      "/" +
                      intl.get("transaction") +
                      "/" +
                      intl.get("block")
                    }
                    onSearch={this.onSearch.bind(this)}
                    className="search"
                    enterButton={
                      <span>
                        <Icon type="search" />
                        {intl.get("search")}
                      </span>
                    }
                  />
                )}
              </Form>
            </div>
          </Col>
          <Col span={4}>
            {this.state.show ? (
              <Button type="primary" onClick={this.handLronman}>
                {intl.get("login")}
              </Button>
            ) : (
              <p>
                <span className="LronmanName">{this.state.account_name}</span>
                <Button type="primary" onClick={this.removeLronman}>
                  {intl.get("logout")}
                </Button>
              </p>
            )}
          </Col>
          <Col span={4}>
            <div>
              <Select
                defaultValue={this.state.language}
                onChange={this.handleChange}
                className="lanSelect"
                suffixIcon={
                  <Icon type="caret-down" style={{ color: "black" }} />
                }
                dropdownClassName="lanSelectDropdown"
              >
                <Option value="zh">简体中文</Option>
                <Option value="en">English</Option>
              </Select>
            </div>
          </Col>
          <Modal
            title={intl.get("checkplugin")}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText={intl.get("gotodownload")}
            cancelText={intl.get("close")}
          >
            <p>{intl.get("checkplugintip1")}</p>
            <p>{intl.get("checkplugintip2")}</p>
          </Modal>
        </Header>
      </Layout>
    );
  }
}

const header = Form.create()(FormHeader);

export default withRouter(header);
