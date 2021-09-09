import React, { Component, lazy, Suspense } from "react";
import { Layout, Menu, Icon, message } from "antd";
import intl from "react-intl-universal";
import "./App.less";
import { get } from "./model/Axios";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderContent from "./components/Header/index";
import FooterContent from "./components/Footer/index";
// import config from "./model/Config";
import logo from "./image/fibos-logo.jpeg";
import home from "./image/home.svg";
import node from "./image/node.svg";
import tool from "./image/tool.svg";
import homeLight from "./image/home-light.svg";
import nodeLight from "./image/node-light.svg";
import toolLight from "./image/tool-light.svg";
import Tool from "./page/Tool";
import { routerConfig } from "./router";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Home = lazy(() => import("./page/Home"));
const Account = lazy(() => import("./page/Account"));
const Reward = lazy(() => import("./page/Reward"));
const Details = lazy(() => import("./page/Details"));
const Transaction = lazy(() => import("./page/Transaction"));
const Publickey = lazy(() => import("./page/PublicKey"));
const Block = lazy(() => import("./page/Block"));
const Node = lazy(() => import("./page/Node"));

// app locale data
const locales = {
  "en-US": require("./locale/en.json"),
  "zh-CN": require("./locale/zh.json")
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "home",
      renderLanguage: true,
      config: {}
    };
    const language = localStorage.getItem("language")
      ? localStorage.getItem("language")
      : "zh";
    if (language === "zh") {
      this.loadLocales("zh-CN");
    } else {
      this.loadLocales("en-US");
    }
  }

  componentDidMount() {
    let array = window.location.pathname.split("/");
    if (array[1]) {
      routerConfig.map((item, index) => {
        if (array[1] === item.pathname) {
          this.setState({
            current: item.menu
          });
        }
        return false;
      });
    } else {
      this.setState({
        current: "home"
      });
    }
    get("/config/config.json")
      .then(data => {
        this.setState({
          config: data
        });
      })
      .catch(err => {
        message.error("获取配置出错");
      });
  }

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  loadLocales(language, sucCb) {
    intl
      .init({
        currentLocale: language, // TODO: determine locale here
        locales
      })
      .then(() => {
        this.setState({
          renderLanguage: !this.state.renderLanguage
        });
      });
  }

  fallback = () => {
    return <div>Loading...</div>;
  };

  render() {
    return (
      <Router>
        <div className="app">
          <Layout>
            <Sider theme="light" width={150} className="appSider">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" />
                  <br />
                  <span>Fibos Mainnet</span>
                </Link>
              </div>
              <Menu
                mode="vertical"
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                className="homeMenu"
              >
                <Menu.Item key="home">
                  <Link to="/">
                    <Icon
                      component={
                        this.state.current === "home" ? homeLight : home
                      }
                      className="menuIcon"
                    />
                    {intl.get("overview")}
                  </Link>
                </Menu.Item>
                <Menu.Item key="node">
                  <Link to="/node">
                    <Icon
                      component={
                        this.state.current === "node" ? nodeLight : node
                      }
                      className="menuIcon"
                    />
                    {intl.get("node")}
                  </Link>
                </Menu.Item>
                {this.state.config.openAccount ? (
                  <SubMenu
                    title={
                      <span className="submenu-title-wrapper" key="sub1">
                        <Icon type="user-add" className="menuIcon" />
                        {intl.get("account")}
                      </span>
                    }
                  >
                    <Menu.Item key="account">
                      <Link to="/account">{intl.get("create")}</Link>
                    </Menu.Item>
                    <Menu.Item key="reward">
                      <Link to="/reward">{intl.get("reward")}</Link>
                    </Menu.Item>
                  </SubMenu>
                ) : (
                  ""
                )}
                <Menu.Item key="tool">
                  <Link to="/tool">
                    <Icon
                      component={
                        this.state.current === "tool" ? toolLight : tool
                      }
                      className="menuIcon"
                    />
                    {intl.get("tool")}
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header className="appHeader">
                <HeaderContent
                  loadLocales={this.loadLocales.bind(this)}
                  language={this.state.language}
                  config={this.state.config}
                />
              </Header>
              <Content className="appContent">
                <Suspense fallback={this.fallback()}>
                  <div className="appContentDiv">
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={() => <Home config={this.state.config} />}
                      />
                      <Route path="/node" render={() => <Node />} />
                      <Route
                        path="/account"
                        render={() => <Account config={this.state.config} />}
                      />
                      <Route
                        path="/tool"
                        render={() => <Tool config={this.state.config} />}
                      />
                      <Route path="/reward" render={() => <Reward />} />
                      <Route
                        path="/details/:name"
                        render={() => <Details config={this.state.config} />}
                      />
                      {/* <Route path="/transfer" component={Transfer} />
                    <Route path="/creatacount" component={CreatAcount} />
                    <Route path="/mortgage" component={Mortgage} />
                    <Route path="/memory" component={Memory} /> */}
                      <Route
                        path="/transaction/:trxid"
                        render={() => (
                          <Transaction config={this.state.config} />
                        )}
                      />
                      <Route
                        path="/publickey/:pubkey"
                        render={() => <Publickey config={this.state.config} />}
                      />
                      <Route
                        path="/block/:blockid"
                        render={() => <Block config={this.state.config} />}
                      />
                    </Switch>
                  </div>
                </Suspense>
              </Content>
              <Footer className="appFooter">
                <FooterContent />
              </Footer>
            </Layout>
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
