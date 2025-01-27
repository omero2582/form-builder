import {formatDistanceToNowStrict} from 'date-fns';

export const getDateSimple = (date) => {
  try{
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'long'}).format(new Date(date))
  }catch(e){
    return date
  }
}

export const getDateSocials = (date) => {
  try{
    return formatDistanceToNowStrict(new Date(date), {addSuffix: true, roundingMethod: 'floor'})
  }catch(e){
    return date
  }
};