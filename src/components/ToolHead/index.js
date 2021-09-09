import React, { Component } from "react";
import intl from "react-intl-universal";

import * as actions from "./action";

import stroage from "../../model/stroage";

import { Card, Col, Row, Progress, Alert } from "antd";

import "./index.less";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_name: "",
      data: {},
      coin: "",
      coinType: ""
    };
  }

  /* 获取资源 */
  getAccount = () => {
    let valueAccount = {
      account_name: this.state.account_name
    };
    let valuesPermissions = {
      code: "eosio.token",
      json: true,
      scope: this.state.account_name,
      table: "accounts"
    };
    actions.getAccount(valueAccount, getAccount => {
      this.setState({
        data: getAccount,
        coinType:
          getAccount &&
          getAccount.total_resources &&
          getAccount.total_resources.cpu_weight
            ? getAccount.total_resources.cpu_weight.split(" ")[1]
            : ""
      });

      actions.getPermissions(valuesPermissions, data => {
        data.rows.map((value, index) => {
          if (
            value.balance.quantity.split(" ")[1] === this.state.coinType &&
            value.balance.contract === "eosio"
          ) {
            this.setState({
              coin: value.balance.quantity
            });
          }
          return data.rows;
        });
      });
    });
  };

  componentDidMount() {}

  componentWillReceiveProps() {
    let account_name = stroage.get("account");
    if (account_name) {
      this.setState(
        {
          account_name: account_name
        },
        () => {
          if (this.state.coin === "") {
            this.getAccount();
          }
        }
      );
    } else {
      this.setState({
        account_name: ""
      });
    }
  }

  render() {
    const { data, coin, coinType } = this.state;

    /* 内存 */
    const ram_usage = data.ram_usage ? (data.ram_usage / 1024).toFixed(2) : 0;
    const ram_quota = data.ram_quota ? (data.ram_quota / 1024).toFixed(2) : 0;
    const ram_progress = data.ram_quota
      ? Number((ram_usage / ram_quota).toFixed(2))
      : 0;

    /* cpu */
    const cpu_used = data.cpu_limit ? data.cpu_limit.used / 1000 : 0;
    const cpu_max = data.cpu_limit ? data.cpu_limit.max / 1000 : 0;
    const cpu_progress = data.cpu_limit
      ? Number((cpu_used / cpu_max).toFixed(2))
      : 0;
    const cpu_used_s = cpu_used > 10000 ? cpu_used / 1000 : cpu_used;
    const cpu_max_s = cpu_max > 10000 ? (cpu_max / 1000).toFixed(2) : cpu_max;

    /* 网络 */
    const net_used = data.net_limit ? data.net_limit.used : 0;
    const net_max = data.net_limit ? (data.net_limit.max / 1024).toFixed(2) : 0;
    const net_progress = data.net_limit
      ? Number((net_used / net_max).toFixed(2))
      : 0;
    const net_max_mb =
      net_max > 10000 ? (net_max * 0.0009766).toFixed(2) : net_max;

    /* 抵押 */
    const resources = data.net_weight
      ? Number((data.net_weight / 10000 + data.cpu_weight / 10000).toFixed(2)) +
        " " +
        coinType
      : 0 + " " + coinType;

    return (
      <div className="toolsHead">
        <div>
          {this.state.account_name ? (
            ""
          ) : (
            <Alert message={intl.get("loginfirst")} type="warning" />
          )}
          <h3 className="acount">
            {intl.get("account")}：<span> {this.state.account_name} </span>
          </h3>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card bordered={false}>
                <h3 className="progress noProgress">
                  {intl.get("mortgaged")} / {intl.get("avabalance")}
                </h3>
                <p className="progressNum">
                  {resources} / {coin}
                </p>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card bordered={false}>
                <h3 className="progress">
                  {intl.get("ram")}：
                  <Progress percent={ram_progress} status="active" />
                </h3>
                <p className="progressNum">
                  {ram_usage} KB / {ram_quota} KB
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card bordered={false}>
                <h3 className="progress">
                  {intl.get("cpu")}：
                  <Progress percent={cpu_progress} status="active" />
                </h3>
                <p className="progressNum">
                  {cpu_used > 10000 ? cpu_used_s + "S" : cpu_used + "MS"} /{" "}
                  {cpu_max > 10000 ? cpu_max_s + "S" : cpu_max + "MS"}{" "}
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card bordered={false}>
                <h3 className="progress">
                  {intl.get("net")}：
                  <Progress percent={net_progress} status="active" />
                </h3>
                <p className="progressNum">
                  {net_used}KB /{" "}
                  {net_max > 10000 ? net_max_mb + "MB" : net_max + "KB"}
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default index;
