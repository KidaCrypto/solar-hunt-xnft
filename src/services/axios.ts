import axios from 'axios';
import { getBaseUrl } from '../utils/common';

export default axios.create({
    baseURL: getBaseUrl(),
});