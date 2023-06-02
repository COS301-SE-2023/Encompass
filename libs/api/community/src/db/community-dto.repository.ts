import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommunitySchema } from "./community.schema";
import { Model } from "mongoose";
import { CommunityDto } from "../community.dto";
import { Community } from "../community";