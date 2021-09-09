import "./index.less";
import { Card, Col, Progress, Row } from "antd";
import intl from 'react-intl-universal'
import React, { Component } from "react";

class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  render() {
    const data = this.props.data;
    const balance = this.props.balance;
    const coin = this.props.coin;
    /* 余额 */
    const quantity = {};
    balance.map((value, index) => {
      if (value.balance.quantity.indexOf("EOS") > -1) {
        quantity.EOS = parseFloat(value.balance.quantity).toFixed(4);
      }

      let reg = RegExp(/FO$/);
      let regFod = RegExp(/FOD$/);
      if (regFod.test(value.balance.quantity)) {
        quantity.FOD = parseFloat(value.balance.quantity).toFixed(4);
      } else if (reg.test(value.balance.quantity)) {
        quantity.FO = parseFloat(value.balance.quantity).toFixed(4);
      }

      return balance;
    });

    quantity.EOS = quantity.EOS ? quantity.EOS : 0;

    quantity.FO = quantity.FO ? quantity.FO : 0;

    /* 资源 */
    const resources =
      data.cpu_weight === -1
        ? -1
        : Number(
            (data.net_weight / 10000 + data.cpu_weight / 10000).toFixed(2)
          );
    /* 内存 */
    const ram_usage = data.ram_usage / 1024;
    const ram_quota = data.ram_quota / 1024;
    const ram_available =
      data.ram_quota === -1
        ? data.ram_quota
        : (ram_quota - ram_usage).toFixed(2);
    /* cpu */
    const cpu_available = data.cpu_limit
      ? data.cpu_limit.available === -1
        ? data.cpu_limit.available
        : (data.cpu_limit.available / 1000).toFixed(2)
      : "";
    const cpu_available_s =
      cpu_available > 10000 ? (cpu_available / 1000).toFixed(2) : cpu_available;
    const cpu_used = data.cpu_limit ? data.cpu_limit.used / 1000 : "";
    const cpu_used_s = cpu_used > 10000 ? cpu_used / 1000 : cpu_used;

    const cpu_max = data.cpu_limit ? data.cpu_limit.max / 1000 : "";
    const cpu_max_s = cpu_max > 10000 ? (cpu_max / 1000).toFixed(2) : cpu_max;
    /* 网络 */
    const net_available = data.net_limit
      ? data.net_limit.available === -1
        ? data.net_limit.available
        : (data.net_limit.available / 1024).toFixed(2)
      : "";
    const net_available_mb =
      net_available > 10000
        ? (net_available * 0.0009766).toFixed(2)
        : net_available;
    const net_used = data.net_limit
      ? (data.net_limit.used / 1024).toFixed(2)
      : "";
    const net_max = data.net_limit
      ? (data.net_limit.max / 1024).toFixed(2)
      : "";
    const net_max_mb =
      net_max > 10000 ? (net_max * 0.0009766).toFixed(2) : net_max;
    /* FO 余额 */
    const FObalance =
      resources === -1 ? Number(quantity.FO) : Number(quantity.FO) + resources;

    const resources_percent =
      resources === -1
        ? 100
        : Number(((resources / FObalance) * 100).toFixed(2));
    const ram_percent =
      ram_available === -1
        ? 100
        : Number(((ram_usage / ram_quota) * 100).toFixed(2));
    const cpu_percent =
      cpu_available === -1
        ? 100
        : Number(((cpu_used / cpu_max) * 100).toFixed(2));
    const net_percent =
      net_available === -1
        ? 100
        : Number(((net_used / net_max) * 100).toFixed(2));

    return (
      <div className="assets">
        <Row>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} className="assetsCol">
            <Card bordered={false}>
              <p className="mortgage">{intl.get('resmortgage')}</p>
              <p className="mortgagenum">
                <span className="number">{intl.get('quantity')}</span>
                <span className="fo">{resources + " " + coin} </span>
              </p>
              <div>
                <Progress percent={resources_percent} status="active" />
              </div>
              {resources === -1 ? (
                ""
              ) : (
                <p className="resources">
                  {resources + " " + coin} / {FObalance.toFixed(4) + " " + coin}
                </p>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} className="assetsCol">
            <Card bordered={false}>
              <p className="mortgage">{intl.get('ram')}（RAM）</p>
              <p className="mortgagenum">
                <span className="number">{intl.get('curava')}</span>
                <span className="fo">{ram_available} KB</span>
              </p>
              <div>
                <Progress percent={ram_percent} status="active" />
              </div>
              {ram_available === -1 ? (
                ""
              ) : (
                <p className="resources">
                  {ram_usage.toFixed(2)} KB / {ram_quota.toFixed(2)} KB
                </p>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} className="assetsCol">
            <Card bordered={false}>
              <p className="mortgage">CPU</p>
              <p className="mortgagenum">
                <span className="number">{intl.get('curava')}</span>
                {cpu_available > 10000 ? (
                  <span className="fo"> {cpu_available_s} S</span>
                ) : (
                  <span className="fo"> {cpu_available} MS</span>
                )}
              </p>
              <div>
                <Progress percent={cpu_percent} status="active" />
              </div>
              {cpu_available === -1 ? (
                ""
              ) : (
                <p className="resources">
                  {cpu_used > 10000 ? cpu_used_s + " S" : cpu_used + " MS"} /{" "}
                  {cpu_max > 10000 ? cpu_max_s + " S" : cpu_max + " MS"}
                </p>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} className="assetsCol">
            <Card bordered={false}>
              <p className="mortgage">{intl.get('net')}</p>
              <p className="mortgagenum">
                <span className="number">{intl.get('curava')}</span>
                {net_available > 10000 ? (
                  <span className="fo"> {net_available_mb} MB</span>
                ) : (
                  <span className="fo"> {net_available} KB</span>
                )}
              </p>
              <div>
                <Progress percent={net_percent} status="active" />
              </div>
              {net_available === -1 ? (
                ""
              ) : (
                <p className="resources">
                  {net_used} KB /{" "}
                  {net_max > 10000 ? net_max_mb + "MB" : net_max + "KB"}
                </p>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Assets;
