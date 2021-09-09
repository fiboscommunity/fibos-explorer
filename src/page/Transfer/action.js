import { message } from "antd";
import axios from "axios";
import intl from "react-intl-universal";

export const transfer = (fo, values, sucCb) => {
  values.quantity = Number(values.quantity).toFixed(
    values.precision ? values.precision : 4
  );
  values.quantity = values.quantity + " " + values.tokens;
  fo.contract("eosio.token").then(contract => {
    contract
      .extransfer(values.from, values.to, values.quantity, values.memo, {
        authorization: values.from
      })
      .then(res => {
        if (res.transaction_id) {
          message.success(intl.get("dosuccess"));
        }
        if (!!res) {
          if (!!sucCb) {
            sucCb(res);
          }
        }
      })
      .catch(err => {
        message.error(intl.get("doerror"));
      });
  });
};

/* 获取持有代币 */
export const getPermissions = (data, sucCb) => {
  axios
    .post("/v1/chain/get_table_rows", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      message.error(intl.get("getcoinerror"));
    });
};
