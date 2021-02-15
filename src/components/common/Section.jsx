import React from "react";
import { Container } from "@material-ui/core";

export default ({ children, className, ...rest}) => {
  return (
    <section className={`pt-10 pb-12 ${className ? className : ''}`} {...rest}>
      <Container maxWidth="lg">
      { children }
      </Container>
    </section>
  );
};


