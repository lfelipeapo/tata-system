import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

const LinkGridComponent = ({ links }) => (
  <Grid container>
    {links.map((link, index) => (
      <Grid item xs key={index}>
        <Link href={link.href} variant="body2">
          {link.text}
        </Link>
      </Grid>
    ))}
  </Grid>
);

export default LinkGridComponent;