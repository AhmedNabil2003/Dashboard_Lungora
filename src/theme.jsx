// theme.js
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light", // الوضع الافتراضي
  useSystemColorMode: false, // تجاهل نظام الجهاز
};

const theme = extendTheme({ config });

export default theme;
