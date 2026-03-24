import { Tooltip, Typography } from "@mui/material";
import { FC } from "react";

export const EllipsesText: FC<{
  value: string | number | null | undefined;
  width?: number;
}> = ({ value, width = 180 }) => {
  const text = value || "-";
  const showTooltip = String(text).length > 25;

  const content = (
    <Typography
      component="span"
      noWrap
      sx={{
        maxWidth: width,
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: 14,
      }}
    >
      {text}
    </Typography>
  );

  return showTooltip ? (
    <Tooltip title={text} arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
};
