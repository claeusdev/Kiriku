import React from "react";
import { Switch, Route } from "react-router-dom";
import Article from "./Article";
export default () => {
  return (
    <div className="LunaAdmin-Content-Collections">
      <Switch>
        <Route path="/admin/collections/article" component={Article} />
      </Switch>
    </div>
  );
};
