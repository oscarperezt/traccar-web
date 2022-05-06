import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditItemView from './EditItemView';
import EditAttributesView from './attributes/EditAttributesView';
import LinkField from './form/LinkField';
import { useTranslation } from './LocalizationProvider';
import useUserAttributes from './attributes/useUserAttributes';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from './store';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const UserPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const currentUserId = useSelector((state) => state.session.user.id);

  const userAttributes = useUserAttributes(t);

  const [item, setItem] = useState();

  const onItemSaved = (result) => {
    if (result.id === currentUserId) {
      dispatch(sessionActions.updateUser(result));
    }
  };

  const validate = () => item && item.name && item.email && (item.id || item.password);

  return (
    <EditItemView endpoint="users" item={item} setItem={setItem} validate={validate} onItemSaved={onItemSaved}>
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                margin="normal"
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
                variant="filled"
              />
              <TextField
                margin="normal"
                value={item.email || ''}
                onChange={(event) => setItem({ ...item, email: event.target.value })}
                label={t('userEmail')}
                variant="filled"
              />
              <TextField
                margin="normal"
                type="password"
                onChange={(event) => setItem({ ...item, password: event.target.value })}
                label={t('userPassword')}
                variant="filled"
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedPreferences')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                margin="normal"
                value={item.phone || ''}
                onChange={(event) => setItem({ ...item, phone: event.target.value })}
                label={t('sharedPhone')}
                variant="filled"
              />
              <TextField
                margin="normal"
                value={item.poiLayer || ''}
                onChange={(event) => setItem({ ...item, poiLayer: event.target.value })}
                label={t('mapPoiLayer')}
                variant="filled"
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedAttributes')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <EditAttributesView
                attributes={item.attributes}
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={userAttributes}
              />
            </AccordionDetails>
          </Accordion>
          {item.id && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedConnections')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <LinkField
                  margin="normal"
                  endpointAll="/api/devices?all=true"
                  endpointLinked={`/api/devices?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="deviceId"
                  label={t('deviceTitle')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/groups?all=true"
                  endpointLinked={`/api/groups?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="groupId"
                  label={t('settingsGroups')}
                  variant="filled"
                />
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </EditItemView>
  );
};

export default UserPage;
