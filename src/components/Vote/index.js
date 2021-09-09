import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import intl from 'react-intl-universal'

import { getProducers, getVoteWeight } from "./action";

import util from "../../model/util";

import { Table } from "antd";

import "./index.less";

function sortBp(a, b) {
  if (a.is_active === b.is_active) {
    return Number(a.total_votes) > Number(b.total_votes) ? -1 : 1;
  } else {
    return a.is_active > b.is_active ? -1 : 1;
  }
}

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VoteWeight: "",
      data: [],
      more: true,
      lower_bound: 0,
      PerblockBucket: "",
      PervoteBucket: "",
      TotalProducerVoteWeight: "",
      TotalUnpaidBlocks: ""
    };
  }

  getProducersData = () => {
    let { more, lower_bound } = this.state;
    let values = {
      json: true,
      code: "eosio",
      scope: "eosio",
      table: "producers",
      lower_bound: 0,
      limit: 500
    };
    getProducers(values, res => {
      if (more) {
        let data = res.rows;
        data.sort(sortBp);
        if (lower_bound === 0) {
          this.setState({
            data: data
          });
        } else {
          this.setState({
            data: this.state.data.concat(data.slice(1))
          });
        }
        this.setState({
          more: res.more,
          lower_bound: data[data.length - 1].owner
        });
      }
    });
  };

  getVoteWeightData = () => {
    let valuesWeight = {
      json: true,
      code: "eosio",
      scope: "eosio",
      table: "global"
    };
    getVoteWeight(valuesWeight, data => {
      this.setState({
        VoteWeight: Number(data.rows[0].total_producer_vote_weight),
        PerblockBucket: Number(data.rows[0].perblock_bucket),
        PervoteBucket: Number(data.rows[0].pervote_bucket),
        TotalProducerVoteWeight: Number(data.rows[0].total_producer_vote_weight),
        TotalUnpaidBlocks: Number(data.rows[0].total_unpaid_blocks)
      });
    });
  };

  goToAccount = account => {
    this.props.history.push({
      pathname: "/details/" + account
    });
  };

  componentDidMount() {
    this.getProducersData();

    this.getVoteWeightData();
  }

  shouldComponentUpdate(nextState, nextProps) {
    const { data, VoteWeight } = this.state;
    if (data.length === 0 || VoteWeight === "") {
      return true;
    } else {
      return false;
    }
  }

  getUnclaimRewards = (
    now,
    last_claim_time,
    rewards,
    block_rewards,
    unpaid_blocks
  ) => {
    const oneday = 24 * 60 * 60 * 1000;
    const day = parseInt((now - last_claim_time / 1000) / oneday);
    const unclaimrewards =
      (day === 0
        ? "0.0000"
        : (rewards * day + block_rewards * unpaid_blocks).toFixed(4));
    return unclaimrewards;
  };

  render() {
    const {
      data,
      VoteWeight,
      PerblockBucket,
      PervoteBucket,
      TotalProducerVoteWeight,
      TotalUnpaidBlocks
    } = this.state;
    const columns = [
      {
        title: intl.get('rank'),
        dataIndex: "id",
        render: (text, record) => {
          const {is_active} = record
          return <div className={is_active ? "numberCircle" : "notActiveNumberCircle"}>{text}</div>;
        }
      },
      {
        title: intl.get('nodeaccount'),
        dataIndex: "account",
        render: (text, record) => {
          return (
            <span
              onClick={() => {
                this.goToAccount(text);
              }}
              className="linkText"
            >
              {text}
            </span>
          );
        }
      },
      {
        title: intl.get('getvote'),
        dataIndex: "votes"
      },
      {
        title: intl.get('votingweight'),
        dataIndex: "weight"
      },
      {
        title: intl.get('votingpercent'),
        dataIndex: "proportion"
      },
      {
        title: intl.get('unclaimedblock'),
        dataIndex: "block"
      },
      {
        title: intl.get('estimatedday'),
        dataIndex: "dayIncome"
      },
      {
        title: intl.get('unclaimed'),
        dataIndex: "income"
      },
      {
        title: intl.get('lasttime'),
        dataIndex: "time"
      },
      {
        title: intl.get('website'),
        dataIndex: "http",
        render: text => (
          <a href={text} target="view_window">
            {text}
          </a>
        )
      }
    ];
    let dataSource = [];
    if (data.length > 0) {
      data.map((value, key) => {
        let total_votes = Number(value.total_votes);
        let last_claim_time =
          value.last_claim_time === 0
            ? ""
            : util.formatDateTime(
                Number(value.last_claim_time.substring(0, 13))
              );
        let vote = Number(
          util.vote2stake(value.total_votes, new Date().getTime()) / 10000
        );
        const score_ratio = value.total_votes / TotalProducerVoteWeight;
        const vote_rewards = Number(
          ((score_ratio * PervoteBucket) / 10000).toFixed(4)
        );
        const block_rewards = Number(
          PerblockBucket / 10000 / TotalUnpaidBlocks
        );
        dataSource.push({
          key: key,
          id: key + 1,
          is_active:value.is_active,
          account: value.owner,
          votes: vote.toFixed(2),
          weight: total_votes.toFixed(2).replace(/\B(?=(?:\d{3})+\b)/g, ","),
          proportion: (total_votes / VoteWeight * 100).toFixed(4) + "%",
          block: value.unpaid_blocks,
          time: last_claim_time,
          http: value.url,
          income:
            vote_rewards < 100
              ? "0.0000"
              : value.last_claim_time === 0
              ? "0.0000"
              : this.getUnclaimRewards(
                  new Date().getTime(),
                  value.last_claim_time,
                  vote_rewards,
                  block_rewards,
                  value.unpaid_blocks
                ),
          dayIncome: vote_rewards
        });
        return dataSource;
      });
    }

    return (
      <div>
        <Table columns={columns} dataSource={dataSource} bordered pagination={{pageSize: 50}}/>
      </div>
    );
  }
}

export default withRouter(Block);
