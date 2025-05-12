export default [
  // ** ERROR ROUTE
  {
    path: "*",
    lazy: async () => {
      const module = await import("@/pages/UnexpectedErrorPage");
      return { Component: module.default, props: { type: "404" } };
    },
  }
];